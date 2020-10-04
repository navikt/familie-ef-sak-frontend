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
