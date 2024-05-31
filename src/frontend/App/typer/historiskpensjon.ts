export interface IHistoriskPensjon {
    historiskPensjonStatus: HistoriskPensjonStatus;
    webAppUrl?: string;
}

export enum HistoriskPensjonStatus {
    HAR_HISTORIKK = 'HAR_HISTORIKK',
    HAR_IKKE_HISTORIKK = 'HAR_IKKE_HISTORIKK',
    UKJENT = 'UKJENT',
}
