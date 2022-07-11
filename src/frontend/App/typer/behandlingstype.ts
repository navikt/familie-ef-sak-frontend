export enum Behandlingstype {
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const behandlingstypeTilTekst: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'Førstegangsbehandling',
    REVURDERING: 'Revurdering',
    TILBAKEKREVING: 'Tilbakekreving',
};

export const behandlingstypeTilTekstKort: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'F',
    REVURDERING: 'R',
    TILBAKEKREVING: 'T',
};
