import { Oppgavetype, Prioritet } from './oppgavetema';
import { Enhetsmappe } from './enhetsmappe';
import { Behandlingstema } from '../../typer/behandlingstema';

export interface IOppgave {
    id: number;
    identer: any[];
    tildeltEnhetsnr?: string;
    endretAvEnhetsnr?: string;
    eksisterendeOppgaveId?: string;
    opprettetAvEnhetsnr?: string;
    journalpostId?: string;
    journalpostkilde?: string;
    behandlesAvApplikasjon?: string;
    saksreferanse?: string;
    bnr?: string;
    samhandlernr?: string;
    aktoerId?: string;
    orgnr?: string;
    tilordnetRessurs?: string;
    beskrivelse?: string;
    temagruppe?: string;
    tema?: string; // TEMA???
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    behandlingstype?: string;
    versjon?: number;
    mappeId?: Enhetsmappe;
    fristFerdigstillelse?: string;
    aktivDato?: string;
    opprettetTidspunkt?: string;
    opprettetAv?: string;
    endretAv?: string;
    ferdigstiltTidspunkt?: string;
    endretTidspunkt?: string;
    prioritet?: Prioritet; //OppgavePrioritet
    status?: string; //StatusEnum
}
