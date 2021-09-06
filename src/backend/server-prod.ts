import './konfigurerApp';

import backend, { IApp } from '@navikt/familie-backend';
import path from 'path';

import { sessionConfig } from './config';
import { prometheusTellere } from './metrikker';
import expressStaticGzip from 'express-static-gzip';
import { setupServer } from './server';
// eslint-disable-next-line

backend(sessionConfig, prometheusTellere).then((iApp: IApp) => {
    const { app } = iApp;
    let middleware;

    if (process.env.NODE_ENV === 'development') {
        throw new Error(`Cannot start prod with process.env.NODE_ENV=${process.env.NODE_ENV}`);
    } else {
        setupServer(iApp, middleware);
        app.use(
            '/assets',
            expressStaticGzip(path.join(__dirname, '../../frontend_production'), {})
        );
    }
});
