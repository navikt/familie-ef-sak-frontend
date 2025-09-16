export interface IBrevmottaker {
    personIdent: string;
    navn: string;
    mottakerRolle: EBrevmottakerRolle;
}

export interface IBrevmottakere {
    personer: IBrevmottaker[];
    organisasjoner: IOrganisasjonMottaker[];
}

export interface IOrganisasjonMottaker {
    organisasjonsnummer: string;
    navnHosOrganisasjon: string;
    mottakerRolle: EBrevmottakerRolle.FULLMEKTIG | EBrevmottakerRolle.MOTTAKER;
}

export enum EBrevmottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
    FULLMEKTIG = 'FULLMEKTIG',
    FULLMAKT = 'FULLMAKT',
    MOTTAKER = 'MOTTAKER',
}

export type BrevmottakerRolleOrganisasjon =
    | EBrevmottakerRolle.FULLMEKTIG
    | EBrevmottakerRolle.MOTTAKER;
