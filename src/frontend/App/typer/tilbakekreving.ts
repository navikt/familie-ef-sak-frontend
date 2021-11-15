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
    AVSLUTTET = 'AVSLUTTET',
    FATTER_VEDTAK = 'FATTER_VEDTAK',
    IVERKSETTER_VEDTAK = 'IVERKSETTER_VEDTAK',
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
}

export const tilbakekrevingBehandlingsstatusTilTekst: Record<
    TilbakekrevingBehandlingsstatus,
    string
> = {
    AVSLUTTET: 'Avsluttet',
    FATTER_VEDTAK: 'Fatter vedtak',
    IVERKSETTER_VEDTAK: 'Iverksetter vedtak',
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
};

export enum TilbakekrevingBehandlingstype {
    TILBAKEKREVING = 'TILBAKEKREVING',
    REVURDERING_TILBAKEKREVING = 'REVURDERING_TILBAKEKREVING',
}

export const tilbakekrevingBehandlingstypeTilTekst: Record<TilbakekrevingBehandlingstype, string> =
    {
        TILBAKEKREVING: 'Tilbakekreving',
        REVURDERING_TILBAKEKREVING: 'Tilbakekreving - revurdering',
    };

export enum TilbakekrevingBehandlingsresultatstype {
    IKKE_FASTSATT = 'IKKE_FASTSATT',
    INGEN_TILBAKEBETALING = 'INGEN_TILBAKEBETALING',
    DELVIS_TILBAKEBETALING = 'DELVIS_TILBAKEBETALING',
    FULL_TILBAKEBETALING = 'FULL_TILBAKEBETALING',
    HENLAGT = 'HENLAGT',
}

export const tilbakekrevingBehandlingsresultattypeTilTekst: Record<
    TilbakekrevingBehandlingsresultatstype,
    string
> = {
    IKKE_FASTSATT: 'Ikke fastsatt',
    INGEN_TILBAKEBETALING: 'Ingen tilbakebetaling',
    DELVIS_TILBAKEBETALING: 'Delvis tilbakebetaling',
    FULL_TILBAKEBETALING: 'Full tilbakebetaling',
    HENLAGT: 'Henlagt',
};
