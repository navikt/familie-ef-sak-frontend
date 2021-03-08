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
            proxyUrl: 'http://familie-ef-sak',
            redisUrl: 'familie-ef-sak-frontend-redis',
        };
    }

    return {
        buildPath: '../../frontend_production',
        namespace: 'production',
        proxyUrl: 'http://familie-ef-sak',
        redisUrl: 'familie-ef-sak-frontend-redis',
    };
};
const env = Environment();

export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: [`${process.env.COOKIE_KEY1}`, `${process.env.COOKIE_KEY2}`],
    navn: 'familie-ef-sak-v1',
    redisPassord: process.env.REDIS_PASSWORD,
    redisUrl: env.redisUrl,
    secureCookie: process.env.ENV === 'local' || process.env.ENV === 'e2e' ? false : true,
    sessionMaxAgeSekunder: 12 * 60 * 60,
};

if (!process.env.EF_SAK_SCOPE2) {
    throw new Error('Scope mot familie-ef-sak er ikke konfigurert');
}

export const oboConfig: IApi = {
    clientId: appConfig.clientId,
    scopes: [process.env.EF_SAK_SCOPE2],
};

export const buildPath = env.buildPath;
export const proxyUrl = env.proxyUrl;
export const namespace = env.namespace;
