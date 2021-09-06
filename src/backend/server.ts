import './konfigurerApp';

import { ensureAuthenticated, IApp } from '@navikt/familie-backend';
import bodyParser from 'body-parser';
import WebpackDevMiddleware from 'webpack-dev-middleware';

import { brevProxyUrl, sakProxyUrl } from './config';
import { attachToken, doProxy } from './proxy';
import setupRouter from './router';
import { logError, logInfo } from '@navikt/familie-logging';
import { NextHandleFunction } from 'connect';

const port = 8000;

export const setupServer = (
    { app, azureAuthClient, router }: IApp,
    middleware?: WebpackDevMiddleware.WebpackDevMiddleware & NextHandleFunction
): void => {
    app.use(
        '/familie-ef-sak/api',
        ensureAuthenticated(azureAuthClient, true),
        attachToken(azureAuthClient),
        doProxy('/familie-ef-sak/api', sakProxyUrl)
    );

    app.use(
        '/familie-brev/api',
        ensureAuthenticated(azureAuthClient, true),
        attachToken(azureAuthClient),
        doProxy('/familie-brev/api', brevProxyUrl)
    );

    // Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(azureAuthClient, router, middleware));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`server startup failed - ${err}`);
    });
};
