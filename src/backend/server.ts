import './konfigurerApp.js';

import path from 'path';

import { buildPath, sessionConfig } from './config.js';
import { prometheusTellere } from './metrikker.js';
import expressStaticGzip from 'express-static-gzip';
import { logInfo } from '@navikt/familie-logging';
import { setupServerFelles } from './server-felles';

backend(sessionConfig, prometheusTellere).then((appConfig: IApp) => {
    logInfo(`Starter opp med miljø: ${process.env.NODE_ENV}`);
    logInfo(`Starter opp med buildpath: ${buildPath}`);

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
