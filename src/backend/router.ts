import { NextFunction, Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import {
    buildPath,
    erLokalUtvikling,
    roller,
    urlAInntekt,
    urlDrek,
    urlGosys,
    urlHistoriskPensjon,
    urlModia,
} from './config.js';
import { prometheusTellere } from './metrikker.js';
import { logInfo, logWarn } from './logger.js';
import { getToken, validateAzureToken } from '@navikt/oasis';

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
        if (erLokalUtvikling) {
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
        async (_req: Request, res: Response) => {
            prometheusTellere.appLoad.inc();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const vite = _req.app.locals.vite as any;
            if (vite) {
                const htmlPath = path.join(vite.config.root, 'index.html');
                let html = fs.readFileSync(htmlPath, 'utf-8');
                html = await vite.transformIndexHtml(_req.originalUrl, html);
                res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            } else {
                res.sendFile('index.html', { root: path.join(process.cwd(), buildPath) });
            }
        }
    );

    return router;
};
