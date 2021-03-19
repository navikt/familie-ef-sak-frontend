export interface IVedtak {
    resultatType: EBehandlingResultat;
    periodeBegrunnelse: string;
    inntektBegrunnelse: string;
}

export enum EBehandlingResultat {
    INNVILGE = 'INNVILGE',
    AVSLÅ = 'AVSLÅ',
    HENLEGGE = 'HENLEGGE',
    BEHANDLE_I_GOSYS = 'BEHANDLE_I_GOSYS',
}
