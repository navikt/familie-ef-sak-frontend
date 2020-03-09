export enum kjønnType {
    'K' = 'K',
    'M' = 'M',
}

// Interface
export interface IPerson {
    fødselsdato: string;
    kjønn?: kjønnType;
    navn?: string;
    personIdent: string;
    type: PersonType;
}

export enum PersonType {
    SØKER = 'SØKER',
    ANNENPART = 'ANNENPART',
    BARN = 'BARN',
}
