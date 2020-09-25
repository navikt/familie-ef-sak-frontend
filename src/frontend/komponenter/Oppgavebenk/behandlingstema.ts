export type Behandlingstema =
    | 'ab0270'
    | 'ab0058'
    | 'ab0180'
    | 'ab0096'
    | 'ab0177'
    | 'ab0028'
    | 'ab0071';

export type BehandlingstemaTekstNokkelPar = {
    [s in Behandlingstema]: string;
};

export const behandlingstemaTilTekst: BehandlingstemaTekstNokkelPar = {
    ab0028: 'Barnetrygd',
    ab0058: 'BarnetrygdEØS',
    ab0071: 'OrdinærBarnetrygd',
    ab0096: 'UtvidetBarnetrygd',
    ab0177: 'Skolepenger',
    ab0180: 'Barnetilsyn',
    ab0270: 'Overgangsstønad',
};
