export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    // Permission-toggles - la stå
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    kanMigrereBarnetilsyn = 'familie.ef.sak.migrering.barnetilsyn',
    henleggBehandlingUtenÅHenleggeOppgave = 'familie.ef.sak.henlegg-behandling-uten-oppgave',
    visSatsendring = 'familie.ef.sak.frontend-vis-satsendring',
    visAutomatiskBehandlingAvTilbakekrevingValg = 'familie.ef.sak.frontend.tilbakekreving-under-4x-rettsgebyr',

    // Miljø-toggles - la stå
    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    visAutomatiskUtfylleVilkår = 'familie.ef.sak.frontend-automatisk-utfylle-vilkar',

    // Release-toggles
    // Midlertidige toggles - kan fjernes etterhvert
}
