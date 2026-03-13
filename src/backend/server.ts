import './konfigurerApp.js';

import path from 'path';
import expressStaticGzip from 'express-static-gzip';
import { createApp, setupRouterAndListen } from './server-felles';

if (process.env.NODE_ENV === 'development') {
    throw Error('Kan ikke starte produksjonsserver i development-miljø');
}

const serverApp = createApp();

serverApp.app.use(
    '/assets',
    expressStaticGzip(path.join(process.cwd(), 'frontend_production'), {})
);

setupRouterAndListen(serverApp);
