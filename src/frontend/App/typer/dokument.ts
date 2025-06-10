import { IJournalpostAvsenderMottaker, Journalposttype, Journalstatus } from './journalføring';
import { Utsendingsinfo } from './utsendingsinfo';
import { compareDesc } from 'date-fns';
import { formaterNullableIsoDatoTid } from '../utils/formatter';

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

export const sorterDokumenter = (dokumenter: Dokumentinfo[]) => {
    return dokumenter
        .sort((a, b) => {
            if (!a.dato) {
                return 1;
            } else if (!b.dato) {
                return -1;
            }
            return compareDesc(new Date(a.dato), new Date(b.dato));
        })
        .filter((dokument) => erFeilregistrertEllerAvbrutt(dokument))
        .map((dokument) => {
            return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
        });
};

export const erFeilregistrertEllerAvbrutt = (dokument: Dokumentinfo) =>
    dokument.journalstatus === 'FEILREGISTRERT' || dokument.journalstatus === 'AVBRUTT';
