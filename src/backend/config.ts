// Konfigurer appen før backend prøver å sette opp konfigurasjon

import { IApi, ISessionKonfigurasjon } from './felles/typer';

type Rolle = 'veileder' | 'saksbehandler' | 'beslutter' | 'kode6' | 'kode7' | 'egenAnsatt';

type Roller = {
    [key in Rolle]: string;
};

interface IEnvironment {
    buildPath: string;
    namespace: string;
    sakProxyUrl: string;
    brevProxyUrl: string;
    aInntekt: string;
    gosys: string;
    modia: string;
    drek: string;
    historiskPensjon: string;
    roller: Roller;
}

const rollerDev: Roller = {
    veileder: '19dcbfde-4cdb-4c64-a1ea-ac9802b03339',
    beslutter: '01166863-22f1-4e16-9785-d7a05a22df74',
    saksbehandler: 'ee5e0b5e-454c-4612-b931-1fe363df7c2c',
    kode6: 'a1b518e2-3947-478d-8929-e5d685c47cac', // 0000-GA-Strengt_Fortrolig_Adresse
    kode7: '2e1dc582-f762-4510-a660-88bf68fb7128', // 0000-GA-Fortrolig_Adresse
    egenAnsatt: 'dbe4ad45-320b-4e9a-aaa1-73cca4ee124d', // 0000-GA-Egne_ansatte
};

const rollerProd: Roller = {
    veileder: '31778fd8-3b71-4867-8db6-a81235fbe001',
    saksbehandler: '6406aba2-b930-41d3-a85b-dd13731bc974',
    beslutter: '5fcc0e1d-a4c2-49f0-93dc-27c9fea41e54',
    kode6: '2931da41-8b8e-42cd-99c0-04a169ddae40', // 0000-GA-Strengt_Fortrolig_Adresse
    kode7: 'e98efc34-12d1-401f-b059-f17e62834065', // 0000-GA-Fortrolig_Adresse
    egenAnsatt: 'e750ceb5-b70b-4d94-b4fa-9d22467b786b', // 0000-GA-Egne_ansatte
};

const Environment = (): IEnvironment => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: 'frontend_development',
            namespace: 'local',
            sakProxyUrl: 'http://localhost:8093',
            brevProxyUrl: 'http://127.0.0.1:8001',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            gosys: 'https://gosys-q1.dev.intern.nav.no/gosys',
            modia: 'https://app-q1.adeo.no/modiapersonoversikt',
            historiskPensjon: 'https://historisk-pensjon.intern.dev.nav.no',
            drek: 'https://pdl-web.dev.intern.nav.no/rekvirerdnummer',
            roller: rollerDev,
        };
    } else if (process.env.ENV === 'e2e') {
        return {
            buildPath: 'frontend_production',
            namespace: 'e2e',
            sakProxyUrl: 'http://familie-ef-sak:8093',
            brevProxyUrl: '', // TODO
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            gosys: 'https://gosys-q1.dev.intern.nav.no/gosys',
            modia: 'https://app-q1.adeo.no/modiapersonoversikt',
            historiskPensjon: 'https://historisk-pensjon.intern.dev.nav.no',
            drek: 'https://pdl-web.dev.intern.nav.no/rekvirerdnummer',
            roller: rollerDev,
            //Har ikke satt opp redis
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: 'frontend_production',
            namespace: 'preprod',
            sakProxyUrl: 'http://familie-ef-sak',
            brevProxyUrl: 'http://familie-brev',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            gosys: 'https://gosys-q1.dev.intern.nav.no/gosys',
            modia: 'https://app-q1.adeo.no/modiapersonoversikt',
            historiskPensjon: 'https://historisk-pensjon.intern.dev.nav.no',
            drek: 'https://pdl-web.dev.intern.nav.no/rekvirerdnummer',
            roller: rollerDev,
        };
    } else if (process.env.ENV === 'lokalt-mot-preprod') {
        return {
            buildPath: 'frontend_development',
            namespace: 'local',
            sakProxyUrl: 'https://familie-ef-sak.intern.dev.nav.no',
            brevProxyUrl: 'https://familie-brev.intern.dev.nav.no',
            aInntekt: 'https://arbeid-og-inntekt.dev.adeo.no',
            gosys: 'https://gosys-q1.dev.intern.nav.no/gosys',
            modia: 'https://app-q1.adeo.no/modiapersonoversikt',
            historiskPensjon: 'https://historisk-pensjon.intern.dev.nav.no',
            drek: 'https://pdl-web.dev.intern.nav.no/rekvirerdnummer',
            roller: rollerDev,
        };
    }

    return {
        buildPath: 'frontend_production',
        namespace: 'production',
        sakProxyUrl: 'http://familie-ef-sak',
        brevProxyUrl: 'http://familie-brev',
        aInntekt: 'https://arbeid-og-inntekt.nais.adeo.no',
        gosys: 'https://gosys.intern.nav.no/gosys',
        modia: 'https://app.adeo.no/modiapersonoversikt',
        historiskPensjon: 'https://historisk-pensjon.intern.nav.no',
        drek: 'https://pdl-web.intern.nav.no/rekvirerdnummer',
        roller: rollerProd,
    };
};
const env = Environment();

export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: [`${process.env.COOKIE_KEY1}`, `${process.env.COOKIE_KEY2}`],
    navn: 'familie-ef-sak-v2',
    redisFullUrl: process.env.REDIS_URI_SESSIONS,
    redisBrukernavn: process.env.REDIS_USERNAME_SESSIONS,
    redisPassord: process.env.REDIS_PASSWORD_SESSIONS,
    secureCookie: !(
        process.env.ENV === 'local' ||
        process.env.ENV === 'e2e' ||
        process.env.ENV === 'lokalt-mot-preprod'
    ),
    sessionMaxAgeSekunder: 12 * 60 * 60,
};

if (!process.env.EF_SAK_SCOPE) {
    throw new Error('Scope mot familie-ef-sak er ikke konfigurert');
}

if (!process.env.CLIENT_ID) {
    throw new Error('CLIENT_ID er ikke konfigurert');
}

export const oboConfig: IApi = {
    clientId: process.env.CLIENT_ID,
    scopes: [process.env.EF_SAK_SCOPE],
};

export const buildPath = env.buildPath;
export const sakProxyUrl = env.sakProxyUrl;
export const brevProxyUrl = env.brevProxyUrl;
export const namespace = env.namespace;
export const urlAInntekt = env.aInntekt;
export const urlGosys = env.gosys;
export const urlModia = env.modia;
export const urlHistoriskPensjon = env.historiskPensjon;
export const urlDrek = env.drek;
export const roller = env.roller;
