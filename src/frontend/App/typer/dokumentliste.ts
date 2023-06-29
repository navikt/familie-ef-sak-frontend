import { Journalposttype, Journalstatus } from '@navikt/familie-typer';
import { IJournalpostAvsenderMottaker } from './journalføring';
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
    logiskeVedlegg: ILogiskVedlegg[];
    avsenderMottaker?: IJournalpostAvsenderMottaker;
    utsendingsinfo?: Utsendingsinfo;
}

export interface ILogiskVedlegg {
    tittel: string;
}
