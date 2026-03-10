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
    erLokalUtvikling,
} from './config';
import { prometheusTellere } from './metrikker';
import { logInfo, logWarn } from './logger';
import { getToken, validateAzureToken } from '@navikt/oasis';
import { erLokaltMotPreprod } from './auth';

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

export const ensureAuthenticated = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (erLokaltMotPreprod() || erLokalUtvikling) {
            return next();
        }

        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Ikke autentisert' });
        }

        const validation = await validateAzureToken(token);
        if (!validation.ok) {
            logWarn(`Token validering feilet: ${validation.error.message}`);
            return res.status(401).json({ error: 'Ugyldig token' });
        }

        return next();
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

    router.post('/logg-feil', (req: Request, res: Response) => {
        const melding = req.body.melding;
        if (req.body.isWarning) {
            logWarn(melding);
        } else {
            logInfo(melding);
        }
        res.status(200).send();
    });

    router.get(
        '*global',
        redirectHvisInternUrlIPreprod(),
        ensureAuthenticated(),
        (_req: Request, res: Response) => {
            prometheusTellere.appLoad.inc();
            res.sendFile('index.html', { root: path.join(process.cwd(), buildPath) });
        }
    );

    return router;
};
