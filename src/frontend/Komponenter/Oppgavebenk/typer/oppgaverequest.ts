import { Behandlingstema } from '../../../App/typer/behandlingstema';
import { Oppgavetype } from './oppgavetema';
import { Enhet } from './enhet';

export interface IOppgaveRequest {
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    enhet?: Enhet;
    mappeId?: number;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettetFom?: string;
    opprettetTom?: string;
    fristFom?: string;
    fristTom?: string;
    ident?: string;
}
