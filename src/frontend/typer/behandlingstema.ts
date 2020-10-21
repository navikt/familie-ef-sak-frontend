export type Behandlingstema =
    | 'ab0270'
    | 'ab0058'
    | 'ab0180'
    | 'ab0096'
    | 'ab0177'
    | 'ab0028'
    | 'ab0071';

export const behandlingstemaTilTekst: Record<Behandlingstema, string> = {
    ab0270: 'Barnetrygd',
    ab0058: 'BarnetrygdEØS',
    ab0071: 'Overgangsstønad',
    ab0096: 'UtvidetBarnetrygd',
    ab0177: 'Skolepenger',
    ab0180: 'OrdinærBarnetrygd',
    ab0028: 'Barnetilsyn',
};

export enum Stønadstype {
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    SKOLEPENGER = 'SKOLEPENGER',
    BARNETILSYN = 'BARNETILSYN',
}

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
