import { Client, getOnBehalfOfAccessToken } from '@navikt/familie-backend';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { oboConfig } from './config';
import { logError, logInfo } from '@navikt/familie-logging';

const restream = (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse) => {
    const requestBody = (req as Request).body;
    if (requestBody) {
        const bodyData = JSON.stringify(requestBody);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (context: string, targetUrl: string): RequestHandler => {
    return createProxyMiddleware(context, {
        changeOrigin: true,
        logLevel: 'info',
        onProxyReq: restream,
        pathRewrite: (path: string, _req: Request) => {
            const newPath = path.replace(context, '');
            return `/api${newPath}`;
        },
        secure: true,
        target: `${targetUrl}`,
    });
};

// eslint-disable-next-line
export const attachToken: any = (authClient: Client) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        getOnBehalfOfAccessToken(authClient, req, oboConfig)
            .then((accessToken: string) => {
                req.headers['Nav-Call-Id'] = uuidv4();
                req.headers.Authorization = `Bearer ${accessToken}`;
                return next();
            })
            .catch((e) => {
                if (e.error === 'invalid_grant') {
                    logInfo(`invalid_grant`);
                    _res.status(500).json({
                        status: 'IKKE_TILGANG',
                        frontendFeilmelding:
                            'Uventet feil. Det er mulig at du ikke har tilgang til applikasjonen.',
                    });
                } else {
                    logError(`Uventet feil - getOnBehalfOfAccessToken  ${e}`);
                    _res.status(500).json({
                        status: 'FEILET',
                        frontendFeilmelding: 'Uventet feil. Vennligst prøv på nytt.',
                    });
                }
            });
    };
};
