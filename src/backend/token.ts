import { NextFunction, Request, Response } from 'express';
import { getToken, requestOboToken, validateToken } from '@navikt/oasis';

export const authenticateToken = (targetAudience: string) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const token = getToken(req);
        if (!token) {
            console.error('Klarte ikke å hente token gjennom Oasis.');
            return;
        }

        const validation = await validateToken(token);
        if (!validation.ok) {
            console.error('Klarte ikke å validere token gjennom Oasis.');
            console.error(`Validering error tilsier: ${validation.error}`);
            console.error(`Validering errorType tilsier: ${validation.errorType}`);
            return;
        }

        const obo = await requestOboToken(token, utledTargetAudience(targetAudience));

        if (!obo.ok) {
            console.error('OBO-token kunne ikke hentes.');
            console.error(`Feil: ${obo.error}`);
            return;
        }

        req.headers['authorization'] = `Bearer ${obo.token}`;
        next();
    };
};

export const utledTargetAudience = (applicationNavn: string) => {
    // TODO: Fix meg.
    const audience = `api://dev-gcp.teamfamilie.${applicationNavn}/.default`;
    return audience;
};
