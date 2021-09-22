export interface IAvsnitt {
    deloverskrift: string;
    innhold: string;
    id?: string;
}

export interface IManueltBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    saksbehandlersignatur: string;
    brevdato: string;
    ident: string;
    navn: string;
}
