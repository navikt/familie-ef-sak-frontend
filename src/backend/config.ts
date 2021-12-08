// Konfigurer appen før backend prøver å sette opp konfigurasjon

import { appConfig, ISessionKonfigurasjon, IApi } from '@navikt/familie-backend';

const Environment = () => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: '../../frontend_development',
            namespace: 'local',
            sakProxyUrl: 'http://localhost:8093',
            brevProxyUrl: 'http://localhost:8001',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            efProxy: 'https://familie-ef-proxy.dev.intern.nav.no',
        };
    } else if (process.env.ENV === 'e2e') {
        return {
            buildPath: '../../frontend_production',
            namespace: 'e2e',
            sakProxyUrl: 'http://familie-ef-sak:8093',
            brevProxyUrl: '', // TODO
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            efProxy: '',
            //Har ikke satt opp redis
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: '../../frontend_production',
            namespace: 'preprod',
            sakProxyUrl: 'http://familie-ef-sak',
            brevProxyUrl: 'http://familie-brev',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            efProxy: 'https://familie-ef-proxy.dev-fss-pub.nais.io',
            redisUrl: 'familie-ef-sak-frontend-redis',
        };
    }

    return {
        buildPath: '../../frontend_production',
        namespace: 'production',
        sakProxyUrl: 'http://familie-ef-sak',
        brevProxyUrl: 'http://familie-brev',
        aInntekt: 'https://arbeid-og-inntekt.nais.adeo.no',
        efProxy: 'https://familie-ef-proxy.prod-fss-pub.nais.io',
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

if (!process.env.EF_SAK_SCOPE) {
    throw new Error('Scope mot familie-ef-sak er ikke konfigurert');
}

export const oboConfig: IApi = {
    clientId: appConfig.clientId,
    scopes: [process.env.EF_SAK_SCOPE],
};

export const buildPath = env.buildPath;
export const sakProxyUrl = env.sakProxyUrl;
export const brevProxyUrl = env.brevProxyUrl;
export const namespace = env.namespace;
export const urlAInntekt = env.aInntekt;
export const efProxyUrl = env.efProxy;
