import './konfigurerApp.js';
import express, { Router } from 'express';
import { setupBackend } from './setupBackend';
import path from 'path';
import { buildPath } from './config.js';
import expressStaticGzip from 'express-static-gzip';
import { logInfo } from '@navikt/familie-logging';

const app = express();
const router = Router();

logInfo(`Starter opp med miljø: ${process.env.NODE_ENV}`);
logInfo(`Starter opp med buildpath: ${buildPath}`);

if (process.env.NODE_ENV === 'development') {
    throw Error('Kan ikke starte produksjonsserver i development-miljø');
} else {
    app.use('/assets', expressStaticGzip(path.join(process.cwd(), 'frontend_production'), {}));
}

setupBackend(app, router);
