//interfaces

export interface IDokumentasjon {
    harSendtInn: boolean;
    vedlegg: IVedlegg[];
}

export interface IVedlegg {
    id: string;
    navn: string;
}
