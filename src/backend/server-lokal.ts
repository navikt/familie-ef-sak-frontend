import './konfigurerApp.js';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
// @ts-expect-error Spesial-import
import config from '../../webpack/webpack.dev.js';
import { createApp, setupRouterAndListen } from './server-felles';

if (process.env.NODE_ENV !== 'development') {
    throw Error('Kan ikke starte lokal-server i produksjonsmiljø');
}

const serverApp = createApp();

const compiler = webpack(config);
if (!compiler) {
    throw Error('Klarte ikke å kompilere webpack config');
}

const middleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    writeToDisk: true,
});

serverApp.app.use(middleware);
serverApp.app.use(webpackHotMiddleware(compiler));

setupRouterAndListen(serverApp);
