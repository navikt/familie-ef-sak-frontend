export enum Behandlingstype {
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
    BLANKETT = 'BLANKETT',
    TEKNISK_OPPHØR = 'TEKNISK_OPPHØR',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const behandlingstypeTilTekst: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'Førstegangsbehandling',
    REVURDERING: 'Revurdering',
    BLANKETT: 'Blankettbehandling',
    TEKNISK_OPPHØR: 'Teknisk opphør',
    TILBAKEKREVING: 'Tilbakekreving',
};

export const behandlingstypeTilTekstKort: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'F',
    REVURDERING: 'R',
    BLANKETT: 'B',
    TEKNISK_OPPHØR: 'TO',
    TILBAKEKREVING: 'T',
};
