// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface IPersonopplysningerPersonIdent {
    personIdent: string;
}

export interface IPersonopplysninger {
    personIdent: string;
    navn: INavn;
    kjønn: kjønnType;
    adressebeskyttelse?: Adressebeskyttelse;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    dødsdato?: string;
    telefonnummer?: ITelefonnummer;
    statsborgerskap: IStatsborgerskap[];
    sivilstand: ISivilstand[];
    adresse: IAdresse[];
    fullmakt: IFullmakt[];
}

export interface IAdresse {
    visningsadresse?: string;
    type: AdresseType;
    gyldigFraOgMed?: string;
    gyldigTilOgMed?: string;
}

export interface IFullmakt {
    gyldigFraOgMed: string;
    gyldigTilOgMed: string;
    motpartsPersonident: string;
    navn?: string;
}

export interface INavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    visningsnavn: string;
}

export interface ITelefonnummer {
    landskode: string;
    nummer: string;
}

export interface IStatsborgerskap {
    land: string;
    gyldigFraOgMed?: string;
    gyldigTilOgMed?: string;
}

export interface ISivilstand {
    type: Sivilstand;
    gyldigFraOgMed?: string;
    relatertVedSivilstand?: string;
    navn?: string;
}

export enum Adressebeskyttelse {
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export enum AdresseType {
    BOSTEDADRESSE = 'BOSTEDADRESSE',
    KONTAKTADRESSE = 'KONTAKTADRESSE',
    KONTAKTADRESSE_UTLAND = 'KONTAKTADRESSE_UTLAND',
    OPPHOLDSADRESSE = 'OPPHOLDSADRESSE',
}

export enum Folkeregisterpersonstatus {
    BOSATT = 'BOSATT',
    UTFLYTTET = 'UTFLYTTET',
    FORSVUNNET = 'FORSVUNNET',
    DOED = 'DOED',
    OPPHOERT = 'OPPHOERT',
    FOEDSELSREGISTRERT = 'FOEDSELSREGISTRERT',
    MIDLERTIDIG = 'MIDLERTIDIG',
    INAKTIV = 'INAKTIV',
    UKJENT = 'UKJENT',
}

export enum Sivilstand {
    UOPPGITT = 'UOPPGITT',
    UGIFT = 'UGIFT',
    GIFT = 'GIFT',
    ENKE_ELLER_ENKEMANN = 'ENKE_ELLER_ENKEMANN',
    SKILT = 'SKILT',
    SEPARERT = 'SEPARERT',
    REGISTRERT_PARTNER = 'REGISTRERT_PARTNER',
    SEPARERT_PARTNER = 'SEPARERT_PARTNER',
    SKILT_PARTNER = 'SKILT_PARTNER',
    GJENLEVENDE_PARTNER = 'GJENLEVENDE_PARTNER',
}
