import { Oppgavetype, Prioritet } from './oppgavetema';
import { Behandlingstema } from '../../../App/typer/behandlingstema';
import { IOppgaveIdent } from '@navikt/familie-typer/dist/oppgave';

export interface IOppgave {
    id: number;
    identer: IOppgaveIdent[];
    tildeltEnhetsnr?: string;
    endretAvEnhetsnr?: string;
    eksisterendeOppgaveId?: string;
    opprettetAvEnhetsnr?: string;
    journalpostId?: string;
    journalpostkilde?: string;
    behandlesAvApplikasjon: string;
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
    mappeId?: number;
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
