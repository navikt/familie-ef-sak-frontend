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
    visSatsendring = 'familie.ef.sak.frontend-vis-satsendring',
    førstegangsbehandling = 'familie.ef.sak.opprett-forstegangsbehandling',
    brukValidering8årHovedperiode = 'familie.ef.sak.frontend-bruk-validering-8ar-hovedperiode',
}
