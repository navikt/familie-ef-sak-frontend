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
    visSettPåVentKnapp = 'familie.ef.sak.frontend.vis-sett-pa-vent-knapp',
    visEndringerPersonopplysninger = 'familie.ef.sak.frontend.personopplysninger-endringer',
    angreSendTilBeslutter = 'familie.ef.sak.frontend-angre-send-til-beslutter',
}
