export enum EToast {
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    BEHANDLING_HENLAGT = 'BEHANDLING_HENLAGT',
    TILBAKEKREVING_OPPRETTET = 'TILBAKEKREVING_OPPRETTET',
}

export const toastTilTekst: Record<EToast, string> = {
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    BEHANDLING_HENLAGT: 'Behandlingen er henlagt',
    TILBAKEKREVING_OPPRETTET:
        'Tilbakekreving blir opprettet. NB! Det kan ta litt tid før du kan se den i behandlingsoversikten.',
};
