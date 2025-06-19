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
    mottakerRolle: EBrevmottakerRolle.VERGE;
}

export enum EBrevmottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
    FULLMAKT = 'FULLMAKT', // Usikker på om denne kanskje bare kan endres til FULLMEKTIG
    FULLMEKTIG = 'FULLMEKTIG',
}
