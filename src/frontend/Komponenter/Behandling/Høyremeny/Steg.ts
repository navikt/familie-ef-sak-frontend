export enum Steg {
    VILKÅR = 'VILKÅR',
    BEREGNE_YTELSE = 'BEREGNE_YTELSE',
    SEND_TIL_BESLUTTER = 'SEND_TIL_BESLUTTER',
    BESLUTTE_VEDTAK = 'BESLUTTE_VEDTAK',
    IVERKSETT_MOT_OPPDRAG = 'IVERKSETT_MOT_OPPDRAG',
    VENTE_PÅ_STATUS_FRA_IVERKSETT = 'VENTE_PÅ_STATUS_FRA_IVERKSETT',
    JOURNALFØR_VEDTAKSBREV = 'JOURNALFØR_VEDTAKSBREV',
    DISTRIBUER_VEDTAKSBREV = 'DISTRIBUER_VEDTAKSBREV',
    FERDIGSTILLE_BEHANDLING = 'FERDIGSTILLE_BEHANDLING',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
    LAG_SAKSBEHANDLINGSBLANKETT = 'LAG_SAKSBEHANDLINGSBLANKETT',
    PUBLISER_VEDTAKSHENDELSE = 'PUBLISER_VEDTAKSHENDELSE',
}

export const stegTypeTilStegtekst: Record<Steg, string> = {
    VILKÅR: 'Vilkårsvurdering',
    BEHANDLING_FERDIGSTILT: 'Behandling ferdigstilt',
    BEREGNE_YTELSE: 'Vedtak og beregning',
    BESLUTTE_VEDTAK: 'Beslutte vedtak',
    DISTRIBUER_VEDTAKSBREV: 'Distribuere vedtaksbrev',
    FERDIGSTILLE_BEHANDLING: 'Ferdigstille behandling',
    IVERKSETT_MOT_OPPDRAG: 'Iverksette mot oppdrag',
    JOURNALFØR_VEDTAKSBREV: 'Journalføre vedtaksbrev',
    SEND_TIL_BESLUTTER: 'Kan sendes til beslutter',
    VENTE_PÅ_STATUS_FRA_IVERKSETT: 'Venter på status fra økonomi',
    LAG_SAKSBEHANDLINGSBLANKETT: 'Opprett saksbehandlingsblankett',
    PUBLISER_VEDTAKSHENDELSE: 'Publisere vedtakshendelse',
};

export const stegTypeTilHistorikkTekst: Record<Steg, string> = {
    VILKÅR: 'Utført vilkårsvurdering',
    BEHANDLING_FERDIGSTILT: 'Behandling ferdigstilt',
    BEREGNE_YTELSE: 'Utført vedtak og beregning',
    BESLUTTE_VEDTAK: 'Besluttet vedtak',
    DISTRIBUER_VEDTAKSBREV: 'Distribuert vedtaksbrev',
    FERDIGSTILLE_BEHANDLING: 'Ferdigstilt behandling',
    IVERKSETT_MOT_OPPDRAG: 'Iverksatt mot oppdrag',
    JOURNALFØR_VEDTAKSBREV: 'Journalført vedtaksbrev',
    SEND_TIL_BESLUTTER: 'Vedtak sendt til godkjenning',
    VENTE_PÅ_STATUS_FRA_IVERKSETT: 'Hentet status fra økonomi',
    LAG_SAKSBEHANDLINGSBLANKETT: 'Opprettet saksbehandlingsblankett',
    PUBLISER_VEDTAKSHENDELSE: 'Publisert vedtakshendelse',
};

export const enum StegUtfall {
    BESLUTTE_VEDTAK_GODKJENT = 'BESLUTTE_VEDTAK_GODKJENT',
    BESLUTTE_VEDTAK_UNDERKJENT = 'BESLUTTE_VEDTAK_UNDERKJENT',
    HENLAGT = 'HENLAGT',
}

export const stegUtfallTilTekst: Record<StegUtfall, string> = {
    BESLUTTE_VEDTAK_GODKJENT: 'Vedtak godkjent',
    BESLUTTE_VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    HENLAGT: 'Behandling henlagt',
};
