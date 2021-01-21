export enum TotrinnskontrollStatus {
    IKKE_AUTORISERT = 'IKKE_AUTORISERT',
    TOTRINNSKONTROLL_UNDERKJENT = 'TOTRINNSKONTROLL_UNDERKJENT',
    UAKTUELT = 'UAKTUELT',
    KAN_FATTE_VEDTAK = 'KAN_FATTE_VEDTAK',
}

export interface Totrinnskontroll {
    status: TotrinnskontrollStatus;
    underkjennelse?: TotrinnskontrollUnderkjennelse;
}

export interface TotrinnskontrollUnderkjennelse {
    begrunnelse: string;
    besluttetAv: string;
    besluttetTid: string;
}
