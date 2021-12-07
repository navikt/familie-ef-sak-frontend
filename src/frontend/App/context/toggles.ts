export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    journalfoer = 'familie.ef.sak.journalfoer',
    TEKNISK_OPPHØR = 'familie.ef.sak.tekniskopphor',
    visTilbakekrevingsVarselToggle = 'familie.ef.sak.frontend-vis-tilbakekreving-varsel',
    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
}
