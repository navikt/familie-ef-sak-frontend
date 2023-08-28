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
    visInntektPersonoversikt = 'familie.ef.sak.frontend.vis-inntekt-personoversikt',
    årsakRevurderingBeskrivelse = 'familie.ef.sak.arsak-revurdering-beskrivelse',
    fremleggsoppgave = 'familie.ef.sak.automatiske-oppgaver.fremleggsoppgave',
}
