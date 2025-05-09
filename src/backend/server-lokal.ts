import './konfigurerApp.js';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { buildPath } from './config.js';
import { logInfo } from '@navikt/familie-logging';
// @ts-expect-error Spesial-import
import config from '../../build_n_deploy/webpack/webpack.dev.js';
import { setupBackend } from './setupBackend';
import express, { Router } from 'express';

let middleware;
const app = express();
const router = Router();

logInfo(`Starter opp med miljø: ${process.env.NODE_ENV}`);
logInfo(`Starter opp med buildpath: ${buildPath}`);

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(config);

    middleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        writeToDisk: true,
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
} else {
    throw Error('Kan ikke starte lokal-server i produksjonsmiljø');
}

setupBackend(app, router);
