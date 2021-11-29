export interface IBrevmottaker {
    personIdent?: string;
    navn?: string;
    mottakerRolle: EBrevmottakerRolle;
}

export enum EBrevmottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
}
