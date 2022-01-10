export interface Toggles {
    [key: string]: boolean;
}

export enum ToggleName {
    TEKNISK_OPPHØR = 'familie.ef.sak.tekniskopphor',
    visIkkePubliserteBrevmaler = 'familie.ef.sak.frontend-vis-ikke-publiserte-brevmaler',
    visOppdateringAvRegisteropplysninger = 'familie.ef.sak.frontend-vis-oppdatering-av-registeropplysninger',
    visSettBrevmottakereKnapp = 'familie.ef.sak.brevmottakere-verge-og-fullmakt',
    innvilgeMedOpphørToggle = 'familie.ef.sak.innvilge-med-opphoer',
    endringslogg = 'familie.ef.sak.endringslogg',
}
