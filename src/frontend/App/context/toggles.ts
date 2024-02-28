export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    // Permission-toggles - la stå
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    kanMigrereBarnetilsyn = 'familie.ef.sak.migrering.barnetilsyn',
    henleggBehandlingUtenÅHenleggeOppgave = 'familie.ef.sak.henlegg-behandling-uten-oppgave',

    // Miljø-toggles - la stå
    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    visAutomatiskUtfylleVilkår = 'familie.ef.sak.frontend-automatisk-utfylle-vilkar',

    // Release-toggles
    // Midlertidige toggles - kan fjernes etterhvert
    visSatsendring = 'familie.ef.sak.frontend-vis-satsendring',
    visInntektPersonoversikt = 'familie.ef.sak.frontend.vis-inntekt-personoversikt',
    visNyJournalføring = 'familie.ef.sak-ny-journalforing',
    visKAVedtakAlternativ = 'familie.ef.sak.frontend.vis-ka-uten-brev',
}
