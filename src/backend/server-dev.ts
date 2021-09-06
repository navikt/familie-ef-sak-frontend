import './konfigurerApp';

import backend, { IApp } from '@navikt/familie-backend';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { sessionConfig } from './config';
import { prometheusTellere } from './metrikker';
import { setupServer } from './server';
// eslint-disable-next-line
const config = require('../../build_n_deploy/webpack/webpack.dev');

backend(sessionConfig, prometheusTellere).then((iApp: IApp) => {
    const { app } = iApp;
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
        throw new Error(`Cannot start dev with process.env.NODE_ENV=${process.env.NODE_ENV}`);
    }
    setupServer(iApp, middleware);
});
