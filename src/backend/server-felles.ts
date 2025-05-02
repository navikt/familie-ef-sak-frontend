import './konfigurerApp.js';

import { IApp } from '@navikt/familie-backend';
import bodyParser from 'body-parser';

import { brevProxyUrl, endringsloggProxyUrl, sakProxyUrl } from './config.js';
import { addRequestInfo, attachToken, doProxy } from './proxy.js';
import setupRouter from './router.js';
import { logError, logInfo } from '@navikt/familie-logging';

const port = 8000;

export const setupServerFelles = ({ app, azureAuthClient, router }: IApp) => {
    app.use('/familie-ef-sak/api', addRequestInfo(), attachToken(), doProxy(sakProxyUrl));

    app.use('/dokument', addRequestInfo(), attachToken(), doProxy(sakProxyUrl));

    app.use('/familie-brev/api', addRequestInfo(), doProxy(brevProxyUrl));

    app.use('/familie-endringslogg', addRequestInfo(), doProxy(endringsloggProxyUrl, ''));

    // Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(azureAuthClient, router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`server startup failed - ${err}`);
    });
};
