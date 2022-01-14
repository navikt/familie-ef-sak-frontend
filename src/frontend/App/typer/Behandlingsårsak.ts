export enum Behandlingsårsak {
    KLAGE = 'KLAGE',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    SØKNAD = 'SØKNAD',
    MIGRERING = 'MIGRERING',
}

export const behandlingsårsakTilTekst: Record<Behandlingsårsak, string> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
};

export const behandlingsårsaker: Behandlingsårsak[] = [
    Behandlingsårsak.KLAGE,
    Behandlingsårsak.NYE_OPPLYSNINGER,
    Behandlingsårsak.SØKNAD,
];
