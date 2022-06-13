export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    visValgmulighetForKorrigering = 'familie.ef.sak.behandling-korrigering', // Permission-toggle

    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    visOppdateringAvRegisteropplysninger = 'familie.ef.sak.frontend-vis-oppdatering-av-registeropplysninger',
    kanMigrereFagsak = 'familie.ef.sak.migrering',
    visValgmulighetForSanksjon = 'familie.ef.sak.frontend-vis-sanksjon-en-maned',
    kanLeggeTilNyeBarnPaaRevurdering = 'familie.ef.sak.kan-legge-til-nye-barn-paa-revurdering',
    visOpprettTilbakekreving = 'familie.ef.sak.frontend-vis-tilbakekreving',
    opprettBehandlingForFerdigstiltJournalpost = 'familie.ef.sak.opprett-behandling-for-ferdigstilt-journalpost',
    kanLeggeTilTerminbarnVidJournalføring = 'familie.ef.sak.frontend-journalforing-kan-legge-til-terminbarn',
    kanJournalFøreSkolepenger = 'familie.ef.sak.skolepenger',
}
