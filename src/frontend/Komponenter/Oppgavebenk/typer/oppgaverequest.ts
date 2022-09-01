import { Behandlingstema } from '../../../App/typer/behandlingstema';
import { Oppgavetype } from './oppgavetema';
import { FortroligEnhet, IkkeFortroligEnhet } from './enhet';

export interface IOppgaveRequest {
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    enhet?: FortroligEnhet | IkkeFortroligEnhet;
    mappeId?: number;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettetFom?: string;
    opprettetTom?: string;
    fristFom?: string;
    fristTom?: string;
    erUtenMappe?: boolean;
    ident?: string;
}
