//interfaces

import { Journalposttype } from './journalforing';

export interface IDokumentasjon {
    harSendtInn: boolean;
    vedlegg: IVedlegg[];
}

export interface IVedlegg {
    id: string;
    navn: string;
}

export interface VedleggDto {
    dokumentinfoId: string;
    filnavn?: string;
    tittel: string;
    journalpostId: string;
    dato?: string;
    journalposttype: Journalposttype;
}
