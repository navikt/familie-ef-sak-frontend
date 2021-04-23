// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface IPersonopplysninger {
    personIdent: string;
    navn: INavn;
    kjønn: kjønnType;
    adressebeskyttelse?: Adressebeskyttelse;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    dødsdato?: string;
    fødselsdato?: string;
    egenAnsatt: boolean;
    telefonnummer?: ITelefonnummer;
    statsborgerskap: IStatsborgerskap[];
    sivilstand: ISivilstand[];
    adresse: IAdresse[];
    fullmakt: IFullmakt[];
    navEnhet: string;
    barn: IBarn[];
    innflyttingTilNorge: IInnflyttingTilNorge[];
    utflyttingFraNorge: IUtflyttingFraNorge[];
    oppholdstillatelse: IOppholdstillatelse[];
}

export interface IBarn {
    navn: string;
    personIdent: string;
    annenForelder?: IAnnenForelderMinimum;
    adresse: IAdresse[];
    borHosSøker: boolean;
    fødselsdato?: string;
}

export interface IAnnenForelderMinimum {
    personIdent: string;
    navn: string;
}

export interface IAdresse {
    visningsadresse?: string;
    type: AdresseType;
    gyldigFraOgMed?: string;
    gyldigTilOgMed?: string;
}

export interface ISøkeresultatPerson {
    hits: IPersonFraSøk[];
    totalHints: number;
    pageNumber: number;
    totalPages: number;
}

export interface IPersonFraSøk {
    personIdent: string;
    visningsadresse: string;
    visningsnavn: string;
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
    gyldigFraOgMedDato?: string;
    gyldigTilOgMedDato?: string;
}

export interface ISivilstand {
    type: SivilstandType;
    gyldigFraOgMed?: string;
    relatertVedSivilstand?: string;
    navn?: string;
}

export interface IInnflyttingTilNorge {
    fraflyttingsland?: string;
    fraflyttingssted?: string;
    dato?: string;
}

export interface IUtflyttingFraNorge {
    tilflyttingsland?: string;
    tilflyttingssted?: string;
    dato?: string;
}

export interface IOppholdstillatelse {
    oppholdstillatelse: OppholdType;
    fraDato?: string;
    tilDato?: string;
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

export enum SivilstandType {
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

export const sivilstandTilTekst: Record<SivilstandType, string> = {
    UOPPGITT: 'Ikke oppgitt',
    UGIFT: 'Ugift',
    GIFT: 'Gift',
    ENKE_ELLER_ENKEMANN: 'Enke/Enkemann',
    SKILT: 'Skilt',
    SKILT_PARTNER: 'Skilt partner',
    SEPARERT: 'Separert',
    SEPARERT_PARTNER: 'Separert partner',
    REGISTRERT_PARTNER: 'Registrert partner',
    GJENLEVENDE_PARTNER: 'Gjenlevende partner',
};

export enum OppholdType {
    MIDLERTIDIG = 'MIDLERTIDIG',
    PERMANENT = 'PERMANENT',
    UKJENT = 'UKJENT',
}

export interface INavKontor {
    navn: string;
    enhetNr: string;
}
