import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { getToken, requestAzureOboToken, parseAzureUserToken } from '@navikt/oasis';
import { efSakScope, erLokalUtvikling } from './config';
import { logError, logInfo } from './logger';
import winston from 'winston';
import { hentAccessTokenFraSession, erLokaltMotPreprod } from './auth';

const restream = (proxyReq: ClientRequest, req: IncomingMessage) => {
    const expressReq = req as Request;

    const authHeader = expressReq.headers['authorization'] || expressReq.headers['Authorization'];
    if (authHeader) {
        proxyReq.setHeader('Authorization', authHeader as string);
    }
    if (expressReq.headers['nav-ident']) {
        proxyReq.setHeader('Nav-Ident', expressReq.headers['nav-ident'] as string);
    }
    if (expressReq.headers['nav-groups']) {
        proxyReq.setHeader('Nav-Groups', expressReq.headers['nav-groups'] as string);
    }
    if (expressReq.headers['nav-user-name']) {
        proxyReq.setHeader('Nav-User-Name', expressReq.headers['nav-user-name'] as string);
    }

    logInfo(
        `[DEBUG] Proxy headers: Nav-Ident=${expressReq.headers['nav-ident']}, Nav-Groups exists=${!!expressReq.headers['nav-groups']}, Auth exists=${!!authHeader}`
    );

    const requestBody = expressReq.body;
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
            leggTilTokenForLokaltMotPreprod(req, res, next);
        }

        if (erLokalUtvikling) {
            req.headers['authorization'] = 'Bearer mock-token';
            return next();
        }

        const token = getToken(req);
        if (!token) {
            logInfo('Mangler token på request');
            return res
                .status(401)
                .json({ status: 'IKKE_TILGANG', frontendFeilmelding: 'Ikke innlogget' });
        }

        await leggTilToken(req, res, token);
        return next();
    };
};

const leggTilTokenForLokaltMotPreprod = (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = hentAccessTokenFraSession(req);
    if (sessionToken) {
        req.headers['authorization'] = `Bearer ${sessionToken}`;
        const parsed = parseAzureUserToken(sessionToken);
        logInfo(`[DEBUG] lokalt-mot-preprod parseAzureUserToken ok=${parsed.ok}`);
        if (parsed.ok) {
            logInfo(`[DEBUG] NAVident=${parsed.NAVident}, groups=${parsed.groups?.length ?? 0}`);
            req.headers['nav-groups'] = JSON.stringify(parsed.groups);
            req.headers['nav-ident'] = parsed.NAVident;
            req.headers['nav-user-name'] = parsed.name;
        } else {
            logError('[DEBUG] parseAzureUserToken feilet', parsed.error);
        }
        return next();
    }

    logInfo('Mangler access token i session');
    return res.status(401).json({
        status: 'IKKE_TILGANG',
        frontendFeilmelding: 'Ikke innlogget',
    });
};

const leggTilToken = async (req: Request, res: Response, token: string) => {
    const parsed = parseAzureUserToken(token);
    logInfo(`[DEBUG] parseAzureUserToken ok=${parsed.ok}`);
    if (parsed.ok) {
        logInfo(`[DEBUG] NAVident=${parsed.NAVident}, groups=${parsed.groups?.length ?? 0}`);
        req.headers['nav-groups'] = JSON.stringify(parsed.groups);
        req.headers['nav-ident'] = parsed.NAVident;
        req.headers['nav-user-name'] = parsed.name;
    } else {
        logError('[DEBUG] parseAzureUserToken feilet', parsed.error);
    }

    const obo = await requestAzureOboToken(token, efSakScope);
    if (!obo.ok) {
        logError('Feil ved henting av OBO-token', new Error(obo.error.message));
        return res.status(500).json({
            status: 'FEILET',
            frontendFeilmelding: 'Kunne ikke hente tilgangstoken. Vennligst prøv på nytt.',
        });
    }

    try {
        const tokenParts = obo.token.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        logInfo(`[DEBUG] OBO token aud=${payload.aud}, iss=${payload.iss}`);
    } catch (e) {
        logInfo('[DEBUG] Kunne ikke decode OBO token');
        console.log(e);
    }

    logInfo(`[DEBUG] OBO token hentet OK, scope=${efSakScope}`);

    req.headers['authorization'] = `Bearer ${obo.token}`;
};
