export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering', // Permission-toggle

    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler', // Miljø-toggle
    kanMigrereFagsak = 'familie.ef.sak.migrering',
    kanMigrereBarnetilsyn = 'familie.ef.sak.migrering.barnetilsyn',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost', // Permission-toggle
    visAutomatiskUtfylleVilkår = 'familie.ef.sak.frontend-automatisk-utfylle-vilkar', // Miljø-toggle
    visSatsendring = 'familie.ef.sak.frontend-vis-satsendring',
    visEndringerPersonopplysninger = 'familie.ef.sak.frontend.personopplysninger-endringer',
    angreSendTilBeslutter = 'familie.ef.sak.frontend-angre-send-til-beslutter',
}
