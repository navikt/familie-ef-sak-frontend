import { NextFunction, Request, Response, Router } from 'express';
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

export const redirectHvisInternUrlIPreprod = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (
            process.env.ENV === 'preprod' &&
            req.headers.host === 'ensligmorellerfar.intern.dev.nav.no'
        ) {
            res.redirect(`https://ensligmorellerfar.ansatt.dev.nav.no${req.url}`);
        } else {
            next();
        }
    };
};

export default (router: Router): Router => {
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

    router.post('/logg-feil', (_req: Request, res: Response) => {
        // TODO: Denne burde være med.
        // logRequest(req, req.body.melding, req.body.isWarning ? LOG_LEVEL.WARNING : LOG_LEVEL.ERROR);
        res.status(200).send();
    });

    router.get('*global', redirectHvisInternUrlIPreprod(), (_req: Request, res: Response) => {
        prometheusTellere.appLoad.inc();

        res.sendFile('index.html', { root: path.join(process.cwd(), buildPath) });
    });

    return router;
};
