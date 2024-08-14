interface OppgaveHeaderConfig {
    tekst: string;
    feltNavn?: string;
    erSorterbar: boolean;
}

export const OppgaveHeaderConfig: OppgaveHeaderConfig[] = [
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
        feltNavn: undefined,
        erSorterbar: false,
    },
    {
        tekst: 'Bruker',
        feltNavn: undefined,
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
        erSorterbar: false,
    },
];
