export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering', // Permission-toggle

    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    kanMigrereFagsak = 'familie.ef.sak.migrering',
    kanMigrereBarnetilsyn = 'familie.ef.sak.migrering.barnetilsyn',
    revurderFraBarnetilsyn = 'familie.ef.sak.barnetilsyn-revurder-fra',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    visAutomatiskUtfylleVilkår = 'familie.ef.sak.frontend-automatisk-utfylle-vilkar',
    visSatsendring = 'familie.ef.sak.frontend-vis-satsendring',
    førstegangsbehandling = 'familie.ef.sak.opprett-forstegangsbehandling',
    automatiskeVedtaksdatoerBrev = 'familie.ef.sak.frontend.automatiskeVedtaksdatoer',
    visSettPåVentKnapp = 'familie.ef.sak.frontend.vis-sett-pa-vent-knapp',
    automatiskeHjemlerBrev = 'familie.ef.sak.frontend.automatiske-hjemler-brev',
}
