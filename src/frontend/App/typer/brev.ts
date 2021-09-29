export interface IAvsnitt {
    deloverskrift: string;
    innhold: string;
    id: string;
}

export interface IFritekstBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    fagsakId?: string;
    behandlingId?: string;
}
