import { Behandlingstema } from './behandlingstema';

type Journalposttype = 'I' | 'U' | 'N';
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

export interface IJojurnalpostResponse {
    journalpost: IJournalpost;
    personIdent: string;
}

export interface BrukerInfo {
    id: string;
    type: BrukerId;
}

export interface IPersonopplysninger {
    personIdent: string;
}
