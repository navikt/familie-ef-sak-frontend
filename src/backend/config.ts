// Konfigurer appen før backend prøver å sette opp konfigurasjon

import { appConfig, IApi, ISessionKonfigurasjon } from '@navikt/familie-backend';

type Rolle = 'veileder' | 'saksbehandler' | 'beslutter' | 'kode6' | 'kode7';

type Roller = {
    [key in Rolle]: string;
};

interface IEnvironment {
    buildPath: string;
    namespace: string;
    sakProxyUrl: string;
    brevProxyUrl: string;
    endringsloggProxyUrl: string;
    aInntekt: string;
    redisUrl?: string;
    roller: Roller;
}

const rollerDev: Roller = {
    veileder: '19dcbfde-4cdb-4c64-a1ea-ac9802b03339',
    beslutter: '01166863-22f1-4e16-9785-d7a05a22df74',
    saksbehandler: 'ee5e0b5e-454c-4612-b931-1fe363df7c2c',
    kode6: '5ef775f2-61f8-4283-bf3d-8d03f428aa14', // 0000-GA-Strengt_Fortrolig_Adresse
    kode7: 'ea930b6b-9397-44d9-b9e6-f4cf527a632a', // 0000-GA-Fortrolig_Adresse
};

const rollerProd: Roller = {
    veileder: '31778fd8-3b71-4867-8db6-a81235fbe001',
    saksbehandler: '6406aba2-b930-41d3-a85b-dd13731bc974',
    beslutter: '5fcc0e1d-a4c2-49f0-93dc-27c9fea41e54',
    kode6: 'ad7b87a6-9180-467c-affc-20a566b0fec0', // 0000-GA-Strengt_Fortrolig_Adresse
    kode7: '9ec6487d-f37a-4aad-a027-cd221c1ac32b', // 0000-GA-Fortrolig_Adresse
};

const Environment = (): IEnvironment => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: '../../frontend_development',
            namespace: 'local',
            sakProxyUrl: 'http://localhost:8093',
            brevProxyUrl: 'http://localhost:8001',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            endringsloggProxyUrl: 'https://familie-endringslogg.dev.intern.nav.no',
            roller: rollerDev,
        };
    } else if (process.env.ENV === 'e2e') {
        return {
            buildPath: '../../frontend_production',
            namespace: 'e2e',
            sakProxyUrl: 'http://familie-ef-sak:8093',
            brevProxyUrl: '', // TODO
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            endringsloggProxyUrl: 'https://familie-endringslogg.dev.intern.nav.no',
            roller: rollerDev,
            //Har ikke satt opp redis
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: '../../frontend_production',
            namespace: 'preprod',
            sakProxyUrl: 'http://familie-ef-sak',
            brevProxyUrl: 'http://familie-brev',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            redisUrl: 'familie-ef-sak-frontend-redis',
            endringsloggProxyUrl: 'https://familie-endringslogg.dev.intern.nav.no',
            roller: rollerDev,
        };
    }

    return {
        buildPath: '../../frontend_production',
        namespace: 'production',
        sakProxyUrl: 'http://familie-ef-sak',
        brevProxyUrl: 'http://familie-brev',
        aInntekt: 'https://arbeid-og-inntekt.nais.adeo.no',
        redisUrl: 'familie-ef-sak-frontend-redis',
        endringsloggProxyUrl: 'https://familie-endringslogg.intern.nav.no',
        roller: rollerProd,
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
export const endringsloggProxyUrl = env.endringsloggProxyUrl;
export const namespace = env.namespace;
export const urlAInntekt = env.aInntekt;
export const roller = env.roller;
