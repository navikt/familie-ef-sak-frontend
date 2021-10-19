export interface TilbakekrevingBehandling {
    behandlingId: string;
    opprettetTidspunkt: string;
    aktiv: boolean;
    type: TilbakekrevingBehandlingstype;
    status: TilbakekrevingBehandlingsstatus;
    vedtaksdato?: string;
    resultat?: TilbakekrevingBehandlingsresultatstype;
}

export enum TilbakekrevingBehandlingsstatus {
    AVSLUTTET,
    FATTER_VEDTAK,
    IVERKSETTER_VEDTAK,
    OPPRETTET,
    UTREDES,
}

export enum TilbakekrevingBehandlingstype {
    TILBAKEKREVING = 'Tilbakekreving',
    REVURDERING_TILBAKEKREVING = 'Tilbakekreving revurdering',
}

export enum TilbakekrevingBehandlingsresultatstype {
    IKKE_FASTSATT,
    INGEN_TILBAKEBETALING,
    DELVIS_TILBAKEBETALING,
    FULL_TILBAKEBETALING,
    HENLAGT,
}
