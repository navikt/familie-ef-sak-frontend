import { Behandlingstema } from '../../typer/behandlingstema';
import { Oppgavetype } from './oppgavetema';
import { Enhet } from './enhet';
import { Enhetsmappe } from './enhetsmappe';

export interface IOppgaveRequest {
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    enhet?: Enhet;
    enhetsmappe?: Enhetsmappe;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettetFom?: string;
    opprettetTom?: string;
    fristFom?: string;
    fristTom?: string;
}
