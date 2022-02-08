export enum Behandlingsårsak {
    KLAGE = 'KLAGE',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    SANKSJON_1_MND = 'SANKSJON_1_MND',
    SØKNAD = 'SØKNAD',
    MIGRERING = 'MIGRERING',
}

export const behandlingsårsakTilTekst: Record<Behandlingsårsak, string> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
};

export const behandlingsårsaker: Behandlingsårsak[] = [
    Behandlingsårsak.KLAGE,
    Behandlingsårsak.NYE_OPPLYSNINGER,
    Behandlingsårsak.SANKSJON_1_MND,
    Behandlingsårsak.SØKNAD,
];
