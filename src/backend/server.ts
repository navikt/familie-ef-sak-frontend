import './konfigurerApp';

import backend, { IApp, ensureAuthenticated } from '@navikt/familie-backend';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { brevProxyUrl, endringsloggProxyUrl, sakProxyUrl, sessionConfig } from './config';
import { prometheusTellere } from './metrikker';
import { addCallId, attachToken, doProxy } from './proxy';
import setupRouter from './router';
import expressStaticGzip from 'express-static-gzip';
import { logError, logInfo } from '@navikt/familie-logging';
// eslint-disable-next-line
const config = require('../../build_n_deploy/webpack/webpack.dev');

const port = 8000;

backend(sessionConfig, prometheusTellere).then(({ app, azureAuthClient, router }: IApp) => {
    let middleware;

    if (process.env.NODE_ENV === 'development') {
        const compiler = webpack(config);
        // @ts-ignore
        middleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
        });

        app.use(middleware);
        // @ts-ignore
        app.use(webpackHotMiddleware(compiler));
    } else {
        app.use(
            '/assets',
            expressStaticGzip(path.join(__dirname, '../../frontend_production'), {})
        );
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
    app.use('/', setupRouter(azureAuthClient, router, middleware));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`server startup failed - ${err}`);
    });
});
