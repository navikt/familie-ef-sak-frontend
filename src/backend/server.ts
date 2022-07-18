import './konfigurerApp.js';

import backend, { IApp, ensureAuthenticated } from '@navikt/familie-backend';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {
    brevProxyUrl,
    buildPath,
    endringsloggProxyUrl,
    sakProxyUrl,
    sessionConfig,
} from './config.js';
import { prometheusTellere } from './metrikker.js';
import { addCallId, attachToken, doProxy } from './proxy.js';
import setupRouter from './router.js';
import expressStaticGzip from 'express-static-gzip';
import { logError, logInfo } from '@navikt/familie-logging';
// @ts-ignore
import config from '../../build_n_deploy/webpack/webpack.dev.js';

const port = 8000;

backend(sessionConfig, prometheusTellere).then(({ app, azureAuthClient, router }: IApp) => {
    let middleware;

    logInfo(`Starter opp med miljø: ${process.env.NODE_ENV}`);
    logInfo(`Starter opp med buildpath: ${buildPath}`);

    if (process.env.NODE_ENV === 'development') {
        const compiler = webpack(config);
        // @ts-ignore
        middleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
            writeToDisk: true,
        });

        app.use(middleware);
        // @ts-ignore
        app.use(webpackHotMiddleware(compiler));
    } else {
        app.use('/assets', expressStaticGzip(path.join(process.cwd(), 'frontend_production'), {}));
    }

    app.use(
        '/familie-ef-sak/api',
        addCallId(),
        ensureAuthenticated(azureAuthClient, true),
        attachToken(azureAuthClient),
        doProxy('/familie-ef-sak/api', sakProxyUrl)
    );

    app.use(
        '/dokument',
        addCallId(),
        ensureAuthenticated(azureAuthClient, false),
        attachToken(azureAuthClient),
        doProxy('/dokument', sakProxyUrl)
    );

    app.use(
        '/familie-brev/api',
        addCallId(),
        ensureAuthenticated(azureAuthClient, true),
        attachToken(azureAuthClient),
        doProxy('/familie-brev/api', brevProxyUrl)
    );

    app.use(
        '/endringslogg',
        addCallId(),
        ensureAuthenticated(azureAuthClient, true),
        attachToken(azureAuthClient),
        doProxy('/endringslogg', endringsloggProxyUrl, '')
    );

    // Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(azureAuthClient, router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`server startup failed - ${err}`);
    });
});
