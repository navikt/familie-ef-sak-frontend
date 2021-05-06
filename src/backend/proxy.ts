import {
    Client,
    error,
    getLogTimestamp,
    getOnBehalfOfAccessToken,
    info,
} from '@navikt/familie-backend';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { oboConfig, proxyUrl } from './config';

const restream = (proxyReq: ClientRequest, req: Request, _res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

// eslint-disable-next-line
export const doProxy: any = (context: string) => {
    return createProxyMiddleware(context, {
        changeOrigin: true,
        logLevel: 'info',
        onProxyReq: restream,
        pathRewrite: (path: string, _req: Request) => {
            const newPath = path.replace(context, '');
            return `/api${newPath}`;
        },
        secure: true,
        target: `${proxyUrl}`,
    });
};

export const attachToken = (authClient: Client) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        getOnBehalfOfAccessToken(authClient, req, oboConfig)
            .then((accessToken: string) => {
                req.headers['Nav-Call-Id'] = uuidv4();
                req.headers.Authorization = `Bearer ${accessToken}`;
                return next();
            })
            .catch((e) => {
                if (e.error === 'invalid_grant') {
                    info(`${getLogTimestamp()}: invalid_grant`);
                    _res.status(500).json({
                        status: 'IKKE_TILGANG',
                        frontendFeilmelding:
                            'Uventet feil. Det er mulig at du ikke har tilgang til applikasjonen.',
                    });
                } else {
                    error(`${getLogTimestamp()}: Uventet feil - getOnBehalfOfAccessToken  ${e}`);
                    _res.status(500).json({
                        status: 'FEILET',
                        frontendFeilmelding: 'Uventet feil. Vennligst prøv på nytt.',
                    });
                }
            });
    };
};
