import { Client, ensureAuthenticated, logRequest } from '@navikt/familie-backend';
import { Request, Response, Router } from 'express';
import path from 'path';
import {
    buildPath,
    roller,
    urlAInntekt,
    urlDrek,
    urlGosys,
    urlHistoriskPensjon,
    urlModia,
} from './config';
import { prometheusTellere } from './metrikker';
import { LOG_LEVEL } from '@navikt/familie-logging';

export default (authClient: Client, router: Router): Router => {
    router.get('/version', (_req: Request, res: Response) => {
        res.status(200).send({ version: process.env.APP_VERSION }).end();
    });
    router.get('/env', (_req: Request, res: Response) => {
        res.status(200)
            .send({
                aInntekt: urlAInntekt,
                gosys: urlGosys,
                modia: urlModia,
                historiskPensjon: urlHistoriskPensjon,
                drek: urlDrek,
                roller,
            })
            .end();
    });

    router.get('/error', (_req: Request, res: Response) => {
        prometheusTellere.errorRoute.inc();
        res.sendFile('error.html', { root: path.join(`assets/`) });
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
