import './konfigurerApp.js';

import bodyParser from 'body-parser';

import { brevProxyUrl, endringsloggProxyUrl, sakProxyUrl } from './config.js';
import { addRequestInfo, doProxy } from './proxy.js';
import setupRouter from './router.js';
import { logError, logInfo } from '@navikt/familie-logging';
import { Express, Request, Response, Router } from 'express';
import { authenticateToken } from './token';

const port = 8001;

export const setupBackend = (app: Express, router: Router) => {
    app.get(['/isAlive', '/isReady'], (_req: Request, res: Response) => {
        res.status(200).end();
    });

    app.use(
        '/familie-ef-sak/api',
        addRequestInfo(),
        authenticateToken('familie-ef-sak'),
        doProxy(sakProxyUrl)
    );

    app.use(
        '/dokument',
        addRequestInfo(),
        authenticateToken('familie-dokument'),
        doProxy(sakProxyUrl)
    );

    app.use(
        '/familie-brev/api',
        addRequestInfo(),
        authenticateToken('familie-brev'),
        doProxy(brevProxyUrl)
    );

    app.use(
        '/familie-endringslogg',
        addRequestInfo(),
        authenticateToken('familie-endringslogg'),
        doProxy(endringsloggProxyUrl, '')
    );

    // Set up bodyParser and router after proxy. Especially important for larger payloads parsed by bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`Server startet med port: ${port}`);
    }).on('error', (err: Error) => {
        logError(`Server start feilet med feil: ${err}`);
    });
};
