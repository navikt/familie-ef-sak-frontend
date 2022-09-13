export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering', // Permission-toggle

    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    kanMigrereFagsak = 'familie.ef.sak.migrering',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    kanLeggeTilTerminbarnVidJournalføring = 'familie.ef.sak.frontend-journalforing-kan-legge-til-terminbarn',
    kanJournalføreEttersendingNyBehandling = 'familie.ef.sak.frontend-journalforing-ettersending-ny-behandling',
    kanJournalFøreSkolepenger = 'familie.ef.sak.skolepenger',
    skalViseOpprettNyBehandlingSkolepenger = 'familie.ef.sak.frontend-skal-vise-opprett-ny-behandling-knapp-skolepenger',
    skalPrefylleVedtaksperider = 'familie.ef.sak.frontend-prefyll-vedtaksperioder',
    skolepengerOpphør = 'familie.ef.sak.skolepenger-opphor',
    visGjenbrukAvVilkår = 'familie.ef.sak.frontend-skal-vise-alertboks-gjenbruk-vilkar',
    visVedtakPeriodeLeggTilRad = 'familie.ef.sak.frontend-vis-vedtak-legg-til-rad-knapp',
    visOpprettKlage = 'familie.ef.sak.frontend-vis-opprett-klage',
}
