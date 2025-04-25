import { NextFunction, Request, Response } from 'express';
import { getToken, validateToken } from '@navikt/oasis';
import { logger } from '@sentry/core';

export const ensuredAuthenticatedByOasis = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getToken(req);

        if (!token) {
            logger.info('Mangler Entra ID token, re-directer bruker til login.');
            return res.redirect('/oauth2/login');
        }

        const validation = await validateToken(token);
        if (!validation.ok) {
            logger.info('Entra ID token er ikke gyldig, re-directer bruker til login.');
            return res.redirect('/oauth2/login');
        }

        return next();
    };
};
