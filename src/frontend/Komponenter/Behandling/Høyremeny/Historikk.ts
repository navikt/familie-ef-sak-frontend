export enum Hendelse {
    OPPRETTET = 'OPPRETTET',
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
    VEDTAK_GODKJENT = 'VEDTAK_GODKJENT',
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    VEDTAK_IVERKSATT = 'VEDTAK_IVERKSATT',
    VEDTAK_AVSLÅTT = 'VEDTAK_AVSLÅTT',
    HENLAGT = 'HENLAGT',
}

export const hendelseTilHistorikkTekst: Record<Hendelse, string> = {
    OPPRETTET: 'Behandling opprettet',
    SENDT_TIL_BESLUTTER: 'Sendt til beslutter',
    VEDTAK_GODKJENT: 'Vedtak godkjent',
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    VEDTAK_IVERKSATT: 'Vedtak iverksatt',
    VEDTAK_AVSLÅTT: 'Vedtak avslått',
    HENLAGT: 'Behandling henlagt',
};
