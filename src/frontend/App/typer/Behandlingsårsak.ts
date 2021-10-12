export enum Behandlingsårsak {
    DØDSFALL = 'DØDSFALL',
    ENDRET_SATS = 'ENDRET_SATS',
    MIGRERING = 'MIGRERING',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    PERIODISK_KONTROLL = 'PERIODISK_KONTROLL',
    SØKNAD = 'SØKNAD',
    TEKNISK_FEIL = 'TEKNISK_FEIL',
}

export const behandlingsårsakTilTekst: Record<Behandlingsårsak, string> = {
    DØDSFALL: 'Dødsfall',
    ENDRET_SATS: 'Endret sats',
    MIGRERING: 'Migrering',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    PERIODISK_KONTROLL: 'Periodisk kontroll',
    SØKNAD: 'Søknad',
    TEKNISK_FEIL: 'Teknisk feil',
};

export const behandlingsårsaker: Behandlingsårsak[] = [
    Behandlingsårsak.DØDSFALL,
    Behandlingsårsak.ENDRET_SATS,
    Behandlingsårsak.MIGRERING,
    Behandlingsårsak.NYE_OPPLYSNINGER,
    Behandlingsårsak.PERIODISK_KONTROLL,
    Behandlingsårsak.SØKNAD,
    Behandlingsårsak.TEKNISK_FEIL,
];
