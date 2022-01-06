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
    organisasjonsnavn: string;
    navnHosOrganisasjon: string;
    mottakerRolle: 'VERGE';
}

export enum EBrevmottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
    FULLMAKT = 'FULLMAKT',
}
