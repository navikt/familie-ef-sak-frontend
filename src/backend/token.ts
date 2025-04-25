import { NextFunction, Request, Response } from 'express';
import { getToken, requestOboToken, validateToken } from '@navikt/oasis';
import { logger } from '@sentry/core';
import { IApi } from '@navikt/familie-backend';
import { oboConfig } from './config';

export const attachTokenByOasis = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getToken(req);

        if (!token) {
            console.log('Mangler Entra ID token, re-directer bruker til login.');
            logger.info('Mangler Entra ID token, re-directer bruker til login.');
            return res.redirect('/oauth2/login');
        }

        const validation = await validateToken(token);
        if (!validation.ok) {
            console.log('Entra ID token er ikke gyldig, re-directer bruker til login.');
            logger.info('Entra ID token er ikke gyldig, re-directer bruker til login.');
            return res.redirect('/oauth2/login');
        }

        const oboToken = getOnBehalfTokenByOasis(token, oboConfig);

        req.headers['authorization'] = `Bearer ${oboToken}`;
        return next();
    };
};

export const getOnBehalfTokenByOasis = async (token: string, oboConfig: IApi) => {
    const audience = oboConfig.clientId;
    console.log(`Audience i oboConfig er: ${audience}`);

    const obo = await requestOboToken(token, audience);

    if (!obo.ok) {
        throw Error('Kunne ikke hente onBehalfOf token gjennom Oasis');
    }

    return obo.token;
};
