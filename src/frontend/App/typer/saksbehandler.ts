export interface ISaksbehandler {
    displayName: string;
    email: string;
    firstName: string;
    groups?: string[];
    identifier: string;
    navIdent: string;
    lastName: string;
    enhet: string;
}

export enum AnsvarligSaksbehandlerRolle {
    IKKE_SATT = 'IKKE_SATT',
    INNLOGGET_SAKSBEHANDLER = 'INNLOGGET_SAKSBEHANDLER',
    ANNEN_SAKSBEHANDLER = 'ANNEN_SAKSBEHANDLER',
}

export interface AnsvarligSaksbehandler {
    azureId: string;
    enhet: string;
    etternavn: string;
    fornavn: string;
    navIdent: string;
    rolle: AnsvarligSaksbehandlerRolle;
}
