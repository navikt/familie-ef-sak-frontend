// Interface
export interface IPerson {
    personinfo: IPersoninfo;
    personhistorikkInfo: IPersonhistorikkInfo;
}

export interface IPersoninfo {
    personIdent: IPersonIdent;
    navn: string;
    bostedsadresse?: IAdresseinfo;
    kjønn?: string;
    fødselsdato: string;
    dødsdato?: string;
    personstatus?: IPersonstatusType;
    sivilstand?: ISivilstandType;
    familierelasjoner?: IFamilierelasjon[];
    statsborgerskap?: ILandkode;
    utlandsadresse?: string;
    geografiskTilknytning?: string;
    diskresjonskode?: string;
    adresseLandkode?: string;
    adresseInfoList?: IAdresseinfo[];
    alder: number;
}

export interface IPersonhistorikkInfo {
    personIdent: IPersonIdent;
    personstatushistorikk: IPersonstatusPeriode[];
    statsborgerskaphistorikk: IStatsborgerskapPeriode[];
    adressehistorikk: IAdressePeriode[];
}

export interface IPersonIdent {
    id: string;
}

export interface IAdresseinfo {
    gjeldendePostadresseType: IAdresseType;
    mottakerNavn: string;
    adresselinje1?: string;
    adresselinje2?: string;
    adresselinje3?: string;
    adresselinje4?: string;
    postNr?: string;
    poststed?: string;
    land?: string;
    personstatus?: IPersonstatusType;
}

export interface IFamilierelasjon {
    personIdent: IPersonIdent;
    relasjonsrolle: IRelasjonsRolleType;
    fødselsdato: string;
    harSammeBosted: boolean;
}

export interface IAdressePeriode {
    periode: IPeriode;
    adresse: IAdresse;
}

export interface IStatsborgerskapPeriode {
    periode?: IPeriode;
    tilhørendeLand: ILandkode;
}

export interface IAdresse {
    adresseType?: IAdresseType;
    adresselinje1?: string;
    adresselinje2?: string;
    adresselinje3?: string;
    adresselinje4?: string;
    postnummer?: string;
    poststed?: string;
    land?: string;
}

export interface IPersonstatusPeriode {
    periode: IPeriode;
    personstatus: IPersonstatusType;
}

export interface IPeriode {
    fom: string;
    tom: string;
}

export interface ILandkode {
    kode: string;
}

export enum ISivilstandType {
    GIFT,
    UGIF,
    ENKE,
    SKIL,
    SKPA,
    SAMB,
    GJPA,
    GLAD,
    NULL,
    REPA,
    SEPA,
    SEPR,
}

export enum IAdresseType {
    BOSTEDSADRESSE,
    POSTADRESSE,
    POSTADRESSE_UTLAND,
    MIDLERTIDIG_POSTADRESSE_NORGE,
    MIDLERTIDIG_POSTADRESSE_UTLAND,
    UKJENT_ADRESSE,
}

export enum IRelasjonsRolleType {
    EKTE,
    BARN,
    FARA,
    MORA,
    REPA,
    SAMB,
    MMOR,
}

export enum IPersonstatusType {
    ABNR,
    UTVA,
    ADNR,
    BOSA,
    DØD,
    DØDD,
    FOSV,
    FØDR,
    UFUL,
    UREG,
    UTAN,
    UTPE,
}
