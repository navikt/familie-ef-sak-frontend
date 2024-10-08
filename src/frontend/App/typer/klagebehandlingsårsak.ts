export enum Klagebehandlingsårsak {
    ORDINÆR = 'ORDINÆR',
    HENVENDELSE_FRA_KABAL = 'HENVENDELSE_FRA_KABAL',
}

export const klagebehandlingsårsakTilTekst: Record<Klagebehandlingsårsak, string> = {
    ORDINÆR: 'Ordinær',
    HENVENDELSE_FRA_KABAL: 'Henvendelse fra KA (uten brev)',
};

export const klagebehandlingsårsakerForOpprettelse = [
    Klagebehandlingsårsak.ORDINÆR,
    Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL,
];
