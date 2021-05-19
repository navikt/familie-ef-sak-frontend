export enum Steg {
    VILKÅR = 'VILKÅR',
    BEREGNE_YTELSE = 'BEREGNE_YTELSE',
    VEDTA_BLANKETT = 'VEDTA_BLANKETT',
    SEND_TIL_BESLUTTER = 'SEND_TIL_BESLUTTER',
    BESLUTTE_VEDTAK = 'BESLUTTE_VEDTAK',
    JOURNALFØR_BLANKETT = 'JOURNALFØR_BLANKETT',
    IVERKSETT_MOT_OPPDRAG = 'IVERKSETT_MOT_OPPDRAG',
    VENTE_PÅ_STATUS_FRA_ØKONOMI = 'VENTE_PÅ_STATUS_FRA_ØKONOMI',
    JOURNALFØR_VEDTAKSBREV = 'JOURNALFØR_VEDTAKSBREV',
    DISTRIBUER_VEDTAKSBREV = 'DISTRIBUER_VEDTAKSBREV',
    FERDIGSTILLE_BEHANDLING = 'FERDIGSTILLE_BEHANDLING',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}

export const stegTypeTilTekst: Record<Steg, string> = {
    VILKÅR: 'Vilkår',
    JOURNALFØR_BLANKETT: 'Blankett journalført',
    VEDTA_BLANKETT: 'Vedta blankett',
    BEHANDLING_FERDIGSTILT: 'Behandling ferdigstilt',
    BEREGNE_YTELSE: 'Beregne ytelse',
    BESLUTTE_VEDTAK: 'Beslutte vedtak',
    DISTRIBUER_VEDTAKSBREV: 'Distribuer vedtaksbrev',
    FERDIGSTILLE_BEHANDLING: 'Ferdigstille behandling',
    IVERKSETT_MOT_OPPDRAG: 'Iverksette mot oppdrag',
    JOURNALFØR_VEDTAKSBREV: 'Journalfør vedtaksbrev',
    SEND_TIL_BESLUTTER: 'Vedtak sendt til godkjenning',
    VENTE_PÅ_STATUS_FRA_ØKONOMI: 'Vente på status fra økonomi',
};

export const enum StegUtfall {
    BESLUTTE_VEDTAK_GODKJENT = 'BESLUTTE_VEDTAK_GODKJENT',
    BESLUTTE_VEDTAK_UNDERKJENT = 'BESLUTTE_VEDTAK_UNDERKJENT',
}

export const stegUtfallTilTekst: Record<StegUtfall, string> = {
    BESLUTTE_VEDTAK_GODKJENT: 'Vedtak godkjent',
    BESLUTTE_VEDTAK_UNDERKJENT: 'Vedtak underkjent',
};
