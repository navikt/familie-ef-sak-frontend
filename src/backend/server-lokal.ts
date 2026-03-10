import './konfigurerApp.js';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { sessionConfig } from './config.js';
import { prometheusTellere } from './metrikker.js';
// @ts-expect-error Spesial-import
import config from '../../webpack/webpack.dev.js';
import { setupServerFelles } from './server-felles';
import { backend, IApp } from './felles/index.js';

backend(sessionConfig, prometheusTellere).then((appConfig: IApp) => {
    let middleware;

    if (process.env.NODE_ENV === 'development') {
        const compiler = webpack(config);

        if (!compiler) {
            throw Error('Klarte ikke å kompilere webpack config');
        }

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
