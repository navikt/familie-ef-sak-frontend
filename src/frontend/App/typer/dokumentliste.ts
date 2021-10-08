import { Journalposttype } from '@navikt/familie-typer';

export interface Dokumentinfo {
    dokumentinfoId: string;
    filnavn?: string;
    tittel: string;
    journalpostId: string;
    dato: string;
    journalposttype: Journalposttype;
}
