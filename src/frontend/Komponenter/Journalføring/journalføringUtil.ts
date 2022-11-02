import { DokumentTitler, IJojurnalpostResponse } from '../../App/typer/journalføring';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';
export const FRA_VANLIG_QUERY_STRING = 'fraVanlig';

export const lagJournalføringKlageUrl = (journalpostId: string, oppgaveId: string): string => {
    return (
        `/journalfor-klage?${JOURNALPOST_QUERY_STRING}=${journalpostId}` +
        `&${OPPGAVEID_QUERY_STRING}=${oppgaveId}&${FRA_VANLIG_QUERY_STRING}=true`
    );
};

export const lagJournalføringUrl = (journalpostId: string, oppgaveId: string): string => {
    return `/journalfor?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}`;
};

export const harTittelForAlleDokumenter = (
    journalResponse: IJojurnalpostResponse,
    dokumentTitler?: DokumentTitler
) =>
    journalResponse.journalpost.dokumenter
        .map((d) => d.tittel || (dokumentTitler && dokumentTitler[d.dokumentInfoId]))
        .every((tittel) => tittel && tittel.trim());
