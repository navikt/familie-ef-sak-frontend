import { Request, Response as ExpressResponse } from 'express';

/**
 * Funksjon som kaller slack sitt postMessage api.
 * Bruker node-fetch da axios ikke bryr seg om proxy agent som sendes inn.
 */
export const slackNotify = (req: Request, res: ExpressResponse, _kanal: string) => {
    if (!req.session) {
        throw Error('Ingen sesjon på requesten');
    }
    res.status(200).send('OK');
};
