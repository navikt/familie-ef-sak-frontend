export type Behandlingstema = 'ab0177' | 'ab0028' | 'ab0071';
export type OppgaveBehandlingstype = 'ae0161';

export const behandlingstemaTilTekst: Record<Behandlingstema, string> = {
    ab0071: 'Overgangsstønad',
    ab0177: 'Skolepenger',
    ab0028: 'Barnetilsyn',
};

export enum Stønadstype {
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    SKOLEPENGER = 'SKOLEPENGER',
    BARNETILSYN = 'BARNETILSYN',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    OVERGANGSSTØNAD: 'Overgangsstønad',
    SKOLEPENGER: 'Skolepenger',
    BARNETILSYN: 'Barnetilsyn',
};

export const stønadstypeTilTekstKort: Record<Stønadstype, string> = {
    OVERGANGSSTØNAD: 'OS',
    SKOLEPENGER: 'SP',
    BARNETILSYN: 'BT',
};

export const behandlingstemaTilStønadstype = (
    behandlingstema: Behandlingstema | undefined
): Stønadstype | undefined => {
    switch (behandlingstema) {
        case 'ab0071':
            return Stønadstype.OVERGANGSSTØNAD;
        case 'ab0177':
            return Stønadstype.SKOLEPENGER;
        case 'ab0028':
            return Stønadstype.BARNETILSYN;
        default:
            return undefined;
    }
};

export const oppgaveBehandlingstypeTilTekst: Record<OppgaveBehandlingstype, string> = {
    ae0161: 'Tilbakekreving',
};
