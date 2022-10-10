export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering', // Permission-toggle

    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    kanMigrereFagsak = 'familie.ef.sak.migrering',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    kanJournalføreEttersendingNyBehandling = 'familie.ef.sak.frontend-journalforing-ettersending-ny-behandling',
    skalPrefylleVedtaksperider = 'familie.ef.sak.frontend-prefyll-vedtaksperioder',
    visVedtakPeriodeLeggTilRad = 'familie.ef.sak.frontend-vis-vedtak-legg-til-rad-knapp',
    visOpprettKlage = 'familie.ef.sak.frontend-vis-opprett-klage',
    visAutomatiskUtfylleVilkår = 'familie.ef.sak.frontend-automatisk-utfylle-vilkar',
}
