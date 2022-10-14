export enum EToast {
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    BEHANDLING_HENLAGT = 'BEHANDLING_HENLAGT',
    TILBAKEKREVING_OPPRETTET = 'TILBAKEKREVING_OPPRETTET',
    KLAGE_OPPRETTET = 'KLAGE_OPPRETTET',
    BREVMOTTAKERE_SATT = 'BREVMOTTAKERE_SATT',
    INNGANGSVILKÅR_GJENBRUKT = 'INNGANGSVILKÅR_GJENBRUKT',
    VEDTAK_NULLSTILT = 'VEDTAK_NULLSTILT',
    OPPRETTET_UTESTENGELSE = 'OPPRETTET_UTESTENGELSE',
    BREV_SENDT = 'BREV_SENDT',
}

export const toastTilTekst: Record<EToast, string> = {
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    BEHANDLING_HENLAGT: 'Behandlingen er henlagt',
    TILBAKEKREVING_OPPRETTET:
        'Tilbakekreving blir opprettet. NB! Det kan ta litt tid før du kan se den i behandlingsoversikten.',
    KLAGE_OPPRETTET: 'Klagen er opprettet og vises nå i behandlingsoversikten',
    BREVMOTTAKERE_SATT: 'Brevmottakere er satt',
    INNGANGSVILKÅR_GJENBRUKT: 'Vilkårsvurdering gjenbrukt',
    VEDTAK_NULLSTILT: 'Lagret vedtak nullstilt',
    OPPRETTET_UTESTENGELSE: 'Utestengelse satt på bruker',
    BREV_SENDT: 'Brevet er nå sendt',
};
