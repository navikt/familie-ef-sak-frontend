// Konfigurer appen før backend prøver å sette opp konfigurasjon

import { appConfig, ISessionKonfigurasjon, IApi } from '@navikt/familie-backend';

const Environment = () => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: '../../frontend_development',
            namespace: 'local',
            proxyUrl: 'http://localhost:8093',
        };
    } else if (process.env.ENV === 'e2e') {
        return {
            buildPath: '../../frontend_production',
            namespace: 'e2e',
            proxyUrl: 'http://familie-ef-sak:8093',
            //Har ikke satt opp redis
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: '../../frontend_production',
            namespace: 'preprod',
            proxyUrl: 'https://familie-ef-sak.dev-fss.nais.io',
        };
    }

    return {
        buildPath: '../../frontend_production',
        namespace: 'production',
        proxyUrl: 'https://familie-ef-sak.prod-fss.nais.io',
    };
};
const env = Environment();

export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: [`${process.env.COOKIE_KEY1}`, `${process.env.COOKIE_KEY2}`],
    navn: 'familie-ef-sak-v1',
    redisPassord: process.env.REDIS_PASSWORD,
    redisUrl: process.env.REDIS_HOST,
    secureCookie: process.env.ENV === 'local' || process.env.ENV === 'e2e' ? false : true,
    sessionMaxAgeSekunder: 12 * 60 * 60,
};

export const saksbehandlerConfig: IApi = {
    clientId: appConfig.clientId,
    scopes: [`${appConfig.clientId}/.default`],
};

if (!process.env.EF_SAK_SCOPE) {
    throw new Error('Scope mot familie-ef-sak er ikke konfigurert');
}

export const oboConfig: IApi = {
    clientId: appConfig.clientId,
    scopes: [process.env.EF_SAK_SCOPE],
};

export const buildPath = env.buildPath;
export const proxyUrl = env.proxyUrl;
export const namespace = env.namespace;
