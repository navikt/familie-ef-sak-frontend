export enum TotrinnskontrollStatus {
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
    TOTRINNSKONTROLL_UNDERKJENT = 'TOTRINNSKONTROLL_UNDERKJENT',
    FATTAR_VEDTAK = 'FATTAR_VEDTAK',
}

export interface Totrinnskontroll {
    status: TotrinnskontrollStatus;
    begrunnelse?: string;
}
