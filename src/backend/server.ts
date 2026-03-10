import './konfigurerApp.js';

import path from 'path';

import { sessionConfig } from './config.js';
import { prometheusTellere } from './metrikker.js';
import expressStaticGzip from 'express-static-gzip';
import { setupServerFelles } from './server-felles';
import { backend, IApp } from './felles/index.js';

backend(sessionConfig, prometheusTellere).then((appConfig: IApp) => {
    if (process.env.NODE_ENV === 'development') {
        throw Error('Kan ikke starte produksjonsserver i development-miljø');
    } else {
        appConfig.app.use(
            '/assets',
            expressStaticGzip(path.join(process.cwd(), 'frontend_production'), {})
        );
    }

    setupServerFelles(appConfig);
});
