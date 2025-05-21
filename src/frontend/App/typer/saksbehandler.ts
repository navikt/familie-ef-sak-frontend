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

export interface Saksbehandler {
    azureId: string;
    navIdent: string;
    fornavn: string;
    etternavn: string;
    enhet: string;
    enhetsnavn: string;
}

export enum AnsvarligSaksbehandlerRolle {
    IKKE_SATT = 'IKKE_SATT',
    INNLOGGET_SAKSBEHANDLER = 'INNLOGGET_SAKSBEHANDLER',
    ANNEN_SAKSBEHANDLER = 'ANNEN_SAKSBEHANDLER',
    OPPGAVE_FINNES_IKKE = 'OPPGAVE_FINNES_IKKE',
    OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER = 'OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER',
    OPPGAVE_TILHØRER_IKKE_ENF = 'OPPGAVE_TILHØRER_IKKE_ENF',
    UTVIKLER_MED_VEILEDERROLLE = 'UTVIKLER_MED_VEILEDERROLLE',
}

export interface AnsvarligSaksbehandler {
    etternavn: string;
    fornavn: string;
    rolle: AnsvarligSaksbehandlerRolle;
}
