export interface IOppgaveIdent {
    ident: string;
    gruppe: IdentGruppe;
}

export enum IdentGruppe {
    AKTOERID = 'AKTOERID',
    FOLKEREGISTERIDENT = 'FOLKEREGISTERIDENT',
    NPID = 'NPID',
    ORGNR = 'ORGNR',
    SAMHANDLERNR = 'SAMHANDLERNR',
}
