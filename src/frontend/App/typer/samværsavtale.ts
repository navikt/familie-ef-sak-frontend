export interface Samværsavtale {
    behandlingId: string;
    behandlingBarnId: string;
    uker: Samværsuke[];
}

export interface JournalførBeregnetSamværRequest {
    personIdent: string;
    uker: Samværsuke[];
    notat: string;
    oppsummering: string;
}

export interface Samværsuke {
    mandag: Samværsdag;
    tirsdag: Samværsdag;
    onsdag: Samværsdag;
    torsdag: Samværsdag;
    fredag: Samværsdag;
    lørdag: Samværsdag;
    søndag: Samværsdag;
}

export interface Samværsdag {
    andeler: Samværsandel[];
}

export enum Samværsandel {
    KVELD_NATT = 'KVELD_NATT',
    MORGEN = 'MORGEN',
    BARNEHAGE_SKOLE = 'BARNEHAGE_SKOLE',
    ETTERMIDDAG = 'ETTERMIDDAG',
}

export const samværsandelTilTekst: Record<Samværsandel, string> = {
    KVELD_NATT: 'Kveld/natt (4/8)',
    MORGEN: 'Morgen (1/8)',
    BARNEHAGE_SKOLE: 'Tiden i bhg/skole (2/8)',
    ETTERMIDDAG: 'Ettermiddag etter bhg/skole (1/8)',
};

export const samværsandelTilVerdi: Record<Samværsandel, number> = {
    KVELD_NATT: 4,
    MORGEN: 1,
    BARNEHAGE_SKOLE: 2,
    ETTERMIDDAG: 1,
};
