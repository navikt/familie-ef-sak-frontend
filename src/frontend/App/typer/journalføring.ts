import { Behandlingstema } from './behandlingstema';

export type Journalposttype = 'I' | 'U' | 'N';

export const journalposttypeTilTekst: Record<Journalposttype, string> = {
    I: 'Inngående',
    N: 'Notat',
    U: 'Utgående',
};

type Journalstatus =
    | 'MOTTATT'
    | 'JOURNALFOERT'
    | 'FERDIGSTILT'
    | 'EKSPEDERT'
    | 'UNDER_ARBEID'
    | 'FEILREGISTRERT'
    | 'UTGAAR'
    | 'AVBRUTT'
    | 'UKJENT_BRUKER'
    | 'RESERVERT'
    | 'OPPLASTING_DOKUMENT'
    | 'UKJENT';

export const gyldigeJournalstatuserTilTekst: Record<string, string> = {
    MOTTATT: 'Mottatt',
    JOURNALFOERT: 'Journalført',
    FERDIGSTILT: 'Ferdigstilt',
    EKSPEDERT: 'Ekspedert',
    UNDER_ARBEID: 'Under arbeid',
    UTGAAR: 'Utgår',
    UKJENT_BRUKER: 'Ukjent bruker',
    RESERVERT: 'Reservert',
    OPPLASTING_DOKUMENT: 'Opplasting',
    UKJENT: 'Ukjent',
};

export const ugyldigeJournalstatuserTilTekst: Record<string, string> = {
    FEILREGISTRERT: 'Feilregistrert',
    AVBRUTT: 'Avbrutt',
};

export const journalstatusTilTekst: Record<string, string> = {
    ...gyldigeJournalstatuserTilTekst,
    ...ugyldigeJournalstatuserTilTekst,
};

type BrukerId = 'AKTOERID' | 'FNR';

type Dokumentstatus = 'FERDIGSTILT' | 'AVBRUTT' | 'UNDER_REDIGERING' | 'KASSERT';
type Dokumentvariant = { variantformat: string };
export type LogiskVedlegg = { logiskVedleggId: string; tittel: string };
type RelevantDato = { dato: string; datotype: string };

export interface DokumentInfo {
    dokumentInfoId: string;
    tittel?: string;
    brevkode?: string;
    dokumentstatus?: Dokumentstatus;
    dokumentvarianter: Dokumentvariant[];
    logiskeVedlegg: LogiskVedlegg[];
}

export interface IJournalpost {
    journalpostId: string;
    journalposttype: Journalposttype;
    journalstatus: Journalstatus;
    tema: string; // 'EF?'
    behandlingstema?: Behandlingstema;
    tittel?: string;
    sak?: string;
    bruker: BrukerInfo;
    journalforendeEnhet?: string;
    kanal?: string;
    dokumenter: DokumentInfo[];
    relevanteDatoer: RelevantDato[];
    datoMottatt?: string;
    avsenderMottaker: IJournalpostAvsenderMottaker | undefined;
}

export interface IJournalpostAvsenderMottaker {
    erLikBruker: boolean;
    id?: string;
    land?: string;
    navn?: string;
    type?: AvsenderMottakerIdType;
}

export enum AvsenderMottakerIdType {
    FNR = 'FNR',
    HPRNR = 'HPRNR',
    ORGNR = 'ORGNR',
    UKJENT = 'UKJENT',
    UTL_ORG = 'UTL_ORG',
    NULL = 'NULL',
}

export const avsenderMottakerIdTypeTilTekst: Record<AvsenderMottakerIdType, string> = {
    FNR: 'fnr',
    HPRNR: 'helsepersonellregister',
    ORGNR: 'orgnr',
    UKJENT: 'ukjent',
    UTL_ORG: 'utl. inst.',
    NULL: '',
};

export interface IJournalpostResponse {
    journalpost: IJournalpost;
    personIdent: string;
    navn: string;
    harStrukturertSøknad: boolean;
}

export interface BrukerInfo {
    id: string;
    type: BrukerId;
}

export type DokumentTitler = Record<string, string>;
export type LogiskeVedleggPåDokument = Record<string, LogiskVedlegg[]>;
