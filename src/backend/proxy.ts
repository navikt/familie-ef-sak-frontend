import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { getToken, requestAzureOboToken } from '@navikt/oasis';
import { efSakScope, erLokalUtvikling } from './config';
import { logError, logInfo } from './logger';
import winston from 'winston';
import { getAccessTokenFromSession, erLokaltMotPreprod } from './auth';

const restream = (proxyReq: ClientRequest, req: IncomingMessage) => {
    const requestBody = (req as Request).body;
    if (requestBody) {
        const bodyData = JSON.stringify(requestBody);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (targetUrl: string, pathPrefix = '/api'): RequestHandler => {
    const logger = winston.createLogger({
        format: winston.format.combine(winston.format.splat(), winston.format.simple()),
        transports: [
            new winston.transports.Console({
                format: winston.format.json(),
            }),
        ],
    });

    return createProxyMiddleware({
        changeOrigin: true,
        logger: logger,
        on: {
            proxyReq: restream,
        },
        pathRewrite: (path: string) => {
            return `${pathPrefix}${path}`;
        },
        secure: true,
        target: `${targetUrl}`,
    });
};

export const addRequestInfo = (): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.headers['Nav-Consumer-Id'] = 'familie-ef-sak-frontend';
        req.headers['nav-call-id'] = uuidv4();
        next();
    };
};

export const attachToken = (): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (erLokaltMotPreprod()) {
            const sessionToken = getAccessTokenFromSession(req);
            if (sessionToken) {
                req.headers.Authorization = `Bearer ${sessionToken}`;
                return next();
            }
            logInfo('Mangler access token i session');
            return res.status(401).json({
                status: 'IKKE_TILGANG',
                frontendFeilmelding: 'Ikke innlogget',
            });
        }

        if (erLokalUtvikling) {
            req.headers.Authorization = 'Bearer mock-token';
            return next();
        }

        const token = getToken(req);
        if (!token) {
            logInfo('Mangler token på request');
            return res
                .status(401)
                .json({ status: 'IKKE_TILGANG', frontendFeilmelding: 'Ikke innlogget' });
        }

        const obo = await requestAzureOboToken(token, efSakScope);
        if (!obo.ok) {
            logError('Feil ved henting av OBO-token', new Error(obo.error.message));
            return res.status(500).json({
                status: 'FEILET',
                frontendFeilmelding: 'Kunne ikke hente tilgangstoken. Vennligst prøv på nytt.',
            });
        }

        req.headers.Authorization = `Bearer ${obo.token}`;
        return next();
    };
};
