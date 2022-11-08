import { Journalposttype, Journalstatus } from '@navikt/familie-typer';
import { IJournalpostAvsenderMottaker } from './journalføring';

export interface Dokumentinfo {
    dokumentinfoId: string;
    filnavn?: string;
    tittel: string;
    journalpostId: string;
    dato?: string;
    journalposttype: Journalposttype;
    journalstatus: Journalstatus;
    logiskeVedlegg: ILogiskVedlegg[];
    avsenderMottaker?: IJournalpostAvsenderMottaker;
}

export interface ILogiskVedlegg {
    tittel: string;
}
