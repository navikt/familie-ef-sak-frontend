import { Request, Response, Router } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { efProxyUrl } from './config';
import { logError } from '@navikt/familie-logging';

export const registretEfProxyEndpoints = (router: Router): void => {
    router.post('/api/generer-ainmtekt-url', (_req: Request, _res: Response) => {
        axios
            .post(
                `${efProxyUrl}/api/ainntekt/generer-url`,
                { ident: _req.body.ident },
                {
                    headers: {
                        accept: 'text/plain',
                    },
                }
            )
            .then((result: AxiosResponse<string>) => {
                _res.status(200).type('text/plain').send(result.data);
            })
            .catch((error: AxiosError<string>) => {
                logError(`Feilet kall for å hente url mot a-inntekt ${error}`);
                _res.status(500).end();
            });
    });
};
