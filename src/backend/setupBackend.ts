import './konfigurerApp.js';

import bodyParser from 'body-parser';

import { brevProxyUrl, endringsloggProxyUrl, sakProxyUrl } from './config.js';
import { addRequestInfo, doProxy } from './proxy.js';
import setupRouter from './router.js';
import { logError, logInfo } from '@navikt/familie-logging';
import { Express, Router } from 'express';
import { authenticateToken } from './token';

const port = 8001;

export const setupBackend = (app: Express, router: Router) => {
    app.use(
        '/familie-ef-sak/api',
        addRequestInfo(),
        authenticateToken(utledTargetAudience('familie-ef-sak')),
        doProxy(sakProxyUrl)
    );

    app.use(
        '/dokument',
        addRequestInfo(),
        authenticateToken(utledTargetAudience('familie-dokument')),
        doProxy(sakProxyUrl)
    );

    app.use(
        '/familie-brev/api',
        addRequestInfo(),
        authenticateToken(utledTargetAudience('familie-brev')),
        doProxy(brevProxyUrl)
    );

    app.use(
        '/familie-endringslogg',
        addRequestInfo(),
        authenticateToken(utledTargetAudience('familie-endringslogg')),
        doProxy(endringsloggProxyUrl, '')
    );

    // Set up bodyParser and router after proxy. Especially important for larger payloads parsed by bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`Server started on port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`Server startup failed - ${err}`);
    });
};

export const utledTargetAudience = (applicationNavn: string) => {
    const miljø = process.env.NODE_ENV;
    const cluster = miljø === 'lokalt-mot-preprod' ? 'dev-gcp' : 'prod-gcp';

    const audience = `api://${cluster}.teamfamilie.${applicationNavn}/.default`;
    return audience;
};
