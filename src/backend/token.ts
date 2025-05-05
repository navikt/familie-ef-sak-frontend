import { NextFunction, Request, Response } from 'express';
import { getToken, requestOboToken, validateToken } from '@navikt/oasis';

export const authenticateToken = (audience: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getToken(req);
        if (!token) {
            console.error('Klarte ikke å hente token gjennom Oasis.');
            return res.redirect('/oauth2/login');
        }

        const validation = await validateToken(token);
        if (!validation.ok) {
            console.error('Klarte ikke å validere token gjennom Oasis.');
            return res.redirect('/oauth2/login');
        }

        const obo = await requestOboToken(token, audience);
        if (!obo.ok) {
            console.error('Klarte ikke å hente onBehalfOf token gjennom Oasis.');
            return res.redirect('/oauth2/login');
        }

        req.headers['authorization'] = `Bearer ${obo.token}`;
        next();
    };
};
