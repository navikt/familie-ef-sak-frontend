import { IJournalpostAvsenderMottaker, Journalposttype, Journalstatus } from './journalføring';
import { Utsendingsinfo } from './utsendingsinfo';

export interface Dokumentinfo {
    dokumentinfoId: string;
    filnavn?: string;
    tittel: string;
    tema: string;
    journalpostId: string;
    dato?: string;
    journalposttype: Journalposttype;
    journalstatus: Journalstatus;
    harSaksbehandlerTilgang: boolean;
    logiskeVedlegg: LogiskVedlegg[];
    avsenderMottaker?: IJournalpostAvsenderMottaker;
    utsendingsinfo?: Utsendingsinfo;
}

export interface LogiskVedlegg {
    tittel: string;
    logiskVedleggId: string;
}
