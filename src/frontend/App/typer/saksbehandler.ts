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
    OPPGAVE_FINNES_IKKE = 'OPPGAVE_FINNES_IKKE',
    UTVIKLER_MED_VEILDERROLLE = 'UTVIKLER_MED_VEILDERROLLE',
}

export interface AnsvarligSaksbehandler {
    etternavn: string;
    fornavn: string;
    rolle: AnsvarligSaksbehandlerRolle;
}
