import { Client, ensureAuthenticated, logRequest } from '@navikt/familie-backend';
import { Request, Response, Router } from 'express';
import path from 'path';
import { buildPath, roller, urlAInntekt } from './config';
import { prometheusTellere } from './metrikker';
import { slackNotify } from './slack/slack';
import { LOG_LEVEL } from '@navikt/familie-logging';

// eslint-disable-next-line
const packageJson = require('../../package.json');

export default (authClient: Client, router: Router): Router => {
    router.get('/version', (_req: Request, res: Response) => {
        res.status(200)
            .send({ version: process.env.APP_VERSION, reduxVersion: packageJson.redux_version })
            .end();
    });
    router.get('/env', (_req: Request, res: Response) => {
        res.status(200).send({ aInntekt: urlAInntekt, roller }).end();
    });

    router.get('/error', (_req: Request, res: Response) => {
        prometheusTellere.errorRoute.inc();
        res.sendFile('error.html', { root: path.join(`assets/`) });
    });

    // SLACK
    router.post('/slack/notify/:kanal', (req: Request, res: Response) => {
        slackNotify(req, res, req.params.kanal);
    });

    router.post('/logg-feil', (req: Request, res: Response) => {
        logRequest(req, req.body.melding, req.body.isWarning ? LOG_LEVEL.WARNING : LOG_LEVEL.ERROR);
        res.status(200).send();
    });

    router.get('*', ensureAuthenticated(authClient, false), (_req: Request, res: Response) => {
        prometheusTellere.appLoad.inc();

        res.sendFile('index.html', { root: path.join(process.cwd(), buildPath) });
    });

    return router;
};
