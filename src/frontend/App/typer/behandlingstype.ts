export enum Behandlingstype {
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
    BLANKETT = 'BLANKETT',
    TEKNISK_OPPHØR = 'TEKNISK_OPPHØR',
}

export const behandlingstypeTilTekst: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'Førstegangsbehandling',
    REVURDERING: 'Revurdering',
    BLANKETT: 'Blankettbehandling',
    TEKNISK_OPPHØR: 'Teknisk opphør',
};
