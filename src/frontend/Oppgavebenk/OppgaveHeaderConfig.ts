import { IOppgave } from './typer/oppgave';
import { OrNothing } from '../App/hooks/felles/useSorteringState';

interface OppgaveHeaderConfig<T> {
    tekst: string;
    feltNavn: OrNothing<keyof T>;
    erSorterbar: boolean;
}

export const OppgaveHeaderConfig: OppgaveHeaderConfig<IOppgave>[] = [
    {
        tekst: 'Reg. dato',
        feltNavn: 'opprettetTidspunkt',
        erSorterbar: true,
    },
    {
        tekst: 'Oppgavetype',
        feltNavn: 'oppgavetype',
        erSorterbar: true,
    },
    {
        tekst: 'Gjelder',
        feltNavn: 'behandlingstema',
        erSorterbar: true,
    },
    {
        tekst: 'Frist',
        feltNavn: 'fristFerdigstillelse',
        erSorterbar: true,
    },
    {
        tekst: 'Prioritet',
        feltNavn: 'prioritet',
        erSorterbar: true,
    },
    {
        tekst: 'Beskrivelse',
        feltNavn: null,
        erSorterbar: false,
    },
    {
        tekst: 'Bruker',
        feltNavn: null,
        erSorterbar: false,
    },
    {
        tekst: 'Enhet',
        feltNavn: 'tildeltEnhetsnr',
        erSorterbar: true,
    },
    {
        tekst: 'Enhetsmappe',
        feltNavn: 'mappeId',
        erSorterbar: true,
    },
    {
        tekst: 'Saksbehandler',
        feltNavn: 'tilordnetRessurs',
        erSorterbar: true,
    },
    {
        tekst: 'Handlinger',
        feltNavn: null,
        erSorterbar: false,
    },
];
