import { Client, ensureAuthenticated, logRequest } from '@navikt/familie-backend';
import { Request, Response, Router } from 'express';
import path from 'path';
import { buildPath } from './config';
import { prometheusTellere } from './metrikker';
import { slackNotify } from './slack/slack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import { LOG_LEVEL } from '@navikt/familie-logging';

// eslint-disable-next-line
const packageJson = require('../../package.json');

export default (
    authClient: Client,
    router: Router,
    middleware?: WebpackDevMiddleware.WebpackDevMiddleware
): Router => {
    router.get('/version', (_req: Request, res: Response) => {
        res.status(200)
            .send({ version: process.env.APP_VERSION, reduxVersion: packageJson.redux_version })
            .end();
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

    // APP
    if (process.env.NODE_ENV === 'development' && middleware) {
        router.get('*', ensureAuthenticated(authClient, false), (_req: Request, res: Response) => {
            prometheusTellere.appLoad.inc();

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(
                middleware.fileSystem.readFileSync(path.join(__dirname, `${buildPath}/index.html`))
            );
            res.end();
        });
    } else {
        router.get('*', ensureAuthenticated(authClient, false), (_req: Request, res: Response) => {
            prometheusTellere.appLoad.inc();

            res.sendFile('index.html', { root: path.join(__dirname, buildPath) });
        });
    }

    return router;
};
