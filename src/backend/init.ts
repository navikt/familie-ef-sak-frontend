import { IApp } from './config';
import { Registry, Counter } from 'prom-client';
import express, { Router } from 'express';
import konfigurerMetrikker from '@navikt/familie-backend';
import headers from '@navikt/familie-backend';
import { logError } from '@navikt/familie-logging';
import { ConfidentialClientApplication } from '@azure/msal-node';

export const init = async (prometheusTellere?: {
    [key: string]: Counter<string>;
}): Promise<IApp> => {
    const app = express();
    let azureAuthClient!: ConfidentialClientApplication;
    let router: Router;

    headers.setup(app);

    // app.get('/isAlive', (_req: Request, res: Response) => {
    //     if (hentErforbindelsenTilRedisTilgjengelig()) {
    //         res.status(200).end();
    //     } else {
    //         res.status(500).end();
    //     }
    // });
    // app.get('/isReady', (_req: Request, res: Response) => {
    //     res.status(200).end();
    // });
    const prometheusRegistry: Registry = konfigurerMetrikker(app, prometheusTellere);

    return konfigurerPassport(passport)
        .then((authClient: ConfidentialClientApplication) => {
            azureAuthClient = authClient;
            router = konfigurerRouter(azureAuthClient, prometheusTellere);

            return {
                app,
                azureAuthClient,
                router,
                prometheusRegistry,
            };
        })
        .catch((err: Error) => {
            logError('Feil ved konfigurasjon av azure', err);
            process.exit(1);
        });
};
