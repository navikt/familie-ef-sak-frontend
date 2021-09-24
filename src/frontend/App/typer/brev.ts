export interface IAvsnitt {
    deloverskrift: string;
    innhold: string;
    id?: string;
}

export interface IManueltBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    fagsakId?: string;
    behandlingId?: string;
}
