export enum Klagebehandlingsårsak {
    STANDARD = 'STANDARD',
    HENVENDELSE_FRA_KABAL = 'HENVENDELSE_FRA_KABAL',
}

export const klagebehandlingsårsakTilTekst: Record<Klagebehandlingsårsak, string> = {
    STANDARD: 'Standard',
    HENVENDELSE_FRA_KABAL: 'Henvendelse fra Kabal',
};

export const klagebehandlingsårsakerForOpprettelse = [
    Klagebehandlingsårsak.STANDARD,
    Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL,
];
