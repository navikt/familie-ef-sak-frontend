export interface IPersonopplysninger {
    personIdent: string;
    navn: INavn;
    kjønn: Kjønn;
    adressebeskyttelse?: Adressebeskyttelse;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    dødsdato?: string;
    fødselsdato?: string;
    egenAnsatt: boolean;
    statsborgerskap: IStatsborgerskap[];
    sivilstand: ISivilstand[];
    adresse: IAdresse[];
    fullmakt: IFullmakt[];
    barn: IBarn[];
    innflyttingTilNorge: IInnflyttingTilNorge[];
    utflyttingFraNorge: IUtflyttingFraNorge[];
    oppholdstillatelse: IOppholdstillatelse[];
    vergemål: IVergemål[];
}

export interface IDeltBostedPeriode {
    startdatoForKontrakt: string;
    sluttdatoForKontrakt: string;
    historisk: boolean;
}

export interface IBarn {
    navn: string;
    personIdent: string;
    annenForelder?: IAnnenForelderMinimum;
    adresse: IAdresse[];

    borHosSøker: boolean;
    deltBosted: IDeltBostedPeriode[];
    harDeltBostedNå: boolean;
    fødselsdato?: string;
    dødsdato?: string;
}

export interface IAnnenForelderMinimum {
    personIdent: string;
    navn: string;
    dødsdato?: string;
}

export interface IAdresse {
    visningsadresse?: string;
    type: AdresseType;
    gyldigFraOgMed?: string;
    gyldigTilOgMed?: string;
    angittFlyttedato?: string;
    erGjeldende: boolean;
}

export interface ISøkeresultatPerson {
    personer: IPersonFraSøk[];
}

export interface IPersonFraSøk {
    personIdent: string;
    visningsadresse: string;
    visningsnavn: string;
    fødselsdato?: string;
    erSøker?: boolean;
    erBarn?: boolean;
}

export interface IFullmakt {
    gyldigFraOgMed: string;
    gyldigTilOgMed: string;
    motpartsPersonident: string;
    navn?: string;
    områder: string[];
}

export interface IVergemål {
    embete?: string;
    type?: string;
    motpartsPersonident?: string;
    navn?: string;
    omfang?: string;
}

export enum Kjønn {
    KVINNE = 'KVINNE',
    MANN = 'MANN',
    UKJENT = 'UKJENT',
}

export interface INavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    visningsnavn: string;
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
    dødsdato?: string;
    erGjeldende: boolean;
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
    DØD = 'DØD',
    OPPHØRT = 'OPPHØRT',
    FØDSELSREGISTRERT = 'FØDSELSREGISTRERT',
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

export const oppholdTilTekst: Record<OppholdType, string> = {
    MIDLERTIDIG: 'Midlertidig',
    PERMANENT: 'Permanent',
    UKJENT: 'Ukjent',
};

export const vergemålTypeTilTekst: Record<string, string> = {
    ensligMindreaarigAsylsoeker: 'Enslig mindreårig asylsøker',
    ensligMindreaarigFlyktning:
        'Enslig mindreårig flyktning inklusive midlertidige saker for denne gruppen',
    voksen: 'Voksen',
    midlertidigForVoksen: 'Voksen midlertidig',
    mindreaarig: 'Mindreårig (unntatt EMF)',
    midlertidigForMindreaarig: 'Mindreårig midlertidig (unntatt EMF)',
    forvaltningUtenforVergemaal: 'Forvaltning utenfor vergemål',
};

export const vergemålOmfangTilTekst: Record<string, string> = {
    utlendingssakerPersonligeOgOekonomiskeInteresser:
        'Personlige og økonomiske, herunder utlendingssaken (kun for EMA)',
    personligeOgOekonomiskeInteresser: 'Personlige og økonomiske',
    oekonomiskeInteresser: 'Økonomiske',
    personligeInteresser: 'Personlige',
};

export interface INavKontor {
    navn: string;
    enhetNr: string;
}
