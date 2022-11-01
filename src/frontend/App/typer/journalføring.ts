import { Behandlingstema } from './behandlingstema';

export type Journalposttype = 'I' | 'U' | 'N';
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

export const journalstatusTilTekst: Record<string, string> = {
    MOTTATT: 'Mottatt',
    JOURNALFOERT: 'Journalført',
    FERDIGSTILT: 'Ferdigstilt',
    EKSPEDERT: 'Ekspedert',
    UNDER_ARBEID: 'Under arbeid',
    FEILREGISTRERT: 'Feilregistrert',
    UTGAAR: 'Utgår',
    AVBRUTT: 'Avbrutt',
    UKJENT_BRUKER: 'Ukjent bruker',
    RESERVERT: 'Reservert',
    OPPLASTING_DOKUMENT: 'Opplasting',
    UKJENT: 'Ukjent',
};

type BrukerId = 'AKTOERID' | 'FNR';

type Dokumentstatus = 'FERDIGSTILT' | 'AVBRUTT' | 'UNDER_REDIGERING' | 'KASSERT';
type Dokumentvariant = { variantformat: string };
type LogiskVedlegg = { logiskVedleggId: string; tittel: string };
type RelevantDato = { dato: string; datotype: string };

interface DokumentInfo {
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
    tittel: string;
    sak?: string;
    bruker: BrukerInfo;
    journalforendeEnhet?: string;
    kanal?: string;
    dokumenter: DokumentInfo[];
    relevanteDatoer: RelevantDato[];
    datoMottatt: string;
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

export interface IJojurnalpostResponse {
    journalpost: IJournalpost;
    personIdent: string;
    navn: string;
    harStrukturertSøknad: boolean;
}

export interface BrukerInfo {
    id: string;
    type: BrukerId;
}
