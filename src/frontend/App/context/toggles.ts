export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    TEKNISK_OPPHØR = 'familie.ef.sak.tekniskopphor',
    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    visOppdateringAvRegisteropplysninger = 'familie.ef.sak.frontend-vis-oppdatering-av-registeropplysninger',
    visSettBrevmottakereKnapp = 'familie.ef.sak.brevmottakere-verge-og-fullmakt',
    MIGRERING = 'familie.ef.sak.migrering',
    visValgmulighetForSanksjon = 'familie.ef.sak.frontend-vis-sanksjon-en-maned',
    kanLeggeTilNyeBarnPaaRevurdering = 'familie.ef.sak.kan-legge-til-nye-barn-paa-revurdering',
    visOpprettTilbakekreving = 'familie.ef.sak.frontend-vis-tilbakekreving',
    oppgavebenkMigrerFagsak = 'familie.ef.sak.frontend-oppgavebenk-migrer-fagsak',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
}
