export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering', // Permission-toggle

    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    kanMigrereFagsak = 'familie.ef.sak.migrering',
    kanMigrereBarnetilsyn = 'familie.ef.sak.migrering.barnetilsyn',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    visAutomatiskUtfylleVilkår = 'familie.ef.sak.frontend-automatisk-utfylle-vilkar',
    visUtestengelse = 'familie.ef.sak.frontend-utestengelse',
    visSatsendring = 'familie.ef.sak.frontend-vis-satsendring',
    avslagMindreInntektsendringer = 'familie.ef.sak.avslag-mindre-inntektsendringer',
    førstegangsbehandling = 'familie.ef.sak.opprett-forstegangsbehandling',
}
