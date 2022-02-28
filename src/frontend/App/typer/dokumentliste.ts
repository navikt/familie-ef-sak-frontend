import { ILogiskVedlegg, Journalposttype, Journalstatus } from '@navikt/familie-typer';

export interface Dokumentinfo {
    dokumentinfoId: string;
    filnavn?: string;
    tittel: string;
    journalpostId: string;
    dato: string;
    journalposttype: Journalposttype;
    journalstatus: Journalstatus;
    logiskeVedlegg?: ILogiskVedlegg[];
}
