import { IJojurnalpostResponse } from '../../App/typer/journalføring';
import { JournalføringStateRequest } from '../../App/hooks/useJournalføringState';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';

export const harTittelForAlleDokumenter = (
    journalResponse: IJojurnalpostResponse,
    journalpostState: JournalføringStateRequest
) =>
    journalResponse.journalpost.dokumenter
        .map(
            (d) =>
                d.tittel ||
                (journalpostState.dokumentTitler &&
                    journalpostState.dokumentTitler[d.dokumentInfoId])
        )
        .every((tittel) => tittel && tittel.trim());
