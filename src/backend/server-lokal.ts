import './konfigurerApp.js';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { buildPath, sessionConfig } from './config.js';
import { prometheusTellere } from './metrikker.js';
import { logInfo } from '@navikt/familie-logging';
// @ts-expect-error Spesial-import
import config from '../../build_n_deploy/webpack/webpack.dev.js';
import { setupServerFelles } from './server-felles';

backend(sessionConfig, prometheusTellere).then((appConfig: IApp) => {
    let middleware;

    logInfo(`Starter opp med miljø: ${process.env.NODE_ENV}`);
    logInfo(`Starter opp med buildpath: ${buildPath}`);

    if (process.env.NODE_ENV === 'development') {
        const compiler = webpack(config);

        middleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
            writeToDisk: true,
        });

        appConfig.app.use(middleware);
        appConfig.app.use(webpackHotMiddleware(compiler));
    } else {
        throw Error('Kan ikke starte lokal-server i produksjonsmiljø');
    }
    setupServerFelles(appConfig);
});
