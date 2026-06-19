export enum Behandlingstype {
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
    TILBAKEKREVING = 'TILBAKEKREVING',
    KLAGE = 'KLAGE',
}

export const behandlingstypeTilTekst: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'Førstegangsbehandling',
    REVURDERING: 'Revurdering',
    TILBAKEKREVING: 'Tilbakekreving',
    KLAGE: 'Klage',
};

export const behandlingstypeTilTekstKort: Record<Behandlingstype, string> = {
    FØRSTEGANGSBEHANDLING: 'F',
    REVURDERING: 'R',
    TILBAKEKREVING: 'T',
    KLAGE: 'K',
};

export type RegelverkType = 'NYTT_REGELVERK' | 'TIDLIGERE_REGELVERK';

export const regelverkLabel = {
    NYTT_REGELVERK: {
        tekst: 'Nytt regelverk fra 01.07.2026',
        kortTekst: 'Regelverk 2026',
    },
    TIDLIGERE_REGELVERK: {
        tekst: 'Tidligere regelverk før 01.07.2026',
        kortTekst: 'Tidligere regelverk',
    },
} satisfies Record<RegelverkType, { tekst: string; kortTekst: string }>;
