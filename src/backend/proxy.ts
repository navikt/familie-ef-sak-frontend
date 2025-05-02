import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { oboConfig, sakProxyUrl } from './config';
import { stdoutLogger } from '@navikt/familie-logging';
import { requestOboToken, validateToken } from '@navikt/oasis';

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
    return createProxyMiddleware({
        changeOrigin: true,
        logger: stdoutLogger,
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
        const token = req.session.passport.user.tokenSets['self'].access_token;

        if (!token) {
            return res.redirect('/oauth2/login');
        }

        const validation = await validateToken(token);

        if (!validation.ok) {
            return res.redirect('/oauth2/login');
        }

        // 'api://dev-gcp.teamfamilie.familie-ef-sak/.default'
        console.log(`oboConfigScopes: ${oboConfig.scopes[0]}`);
        console.log(`client: ${oboConfig.clientId}`);

        const obo = await requestOboToken(token, sakProxyUrl);

        if (!obo.ok) {
            return res.redirect('/oauth2/login');
        }
        req.headers.Authorization = `Bearer ${obo.token}`;
        return next();
    };
};
