export interface Klagebehandlinger {
    overgangsstønad: KlageBehandling[];
    barnetilsyn: KlageBehandling[];
    skolepenger: KlageBehandling[];
}

export interface KlageBehandling {
    fagsakId: string;
    id: string;
    mottattDato: string;
    opprettet: string;
    resultat: KlagebehandlingResultat | undefined;
    status: KlagebehandlingStatus;
    vedtaksdato: string | undefined;
    årsak: KlageÅrsak | undefined;
}

export enum KlagebehandlingResultat {
    MEDHOLD = 'MEDHOLD',
    IKKE_MEDHOLD = 'IKKE_MEDHOLD',
    IKKE_SATT = 'IKKE_SATT',
}

export enum KlagebehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
}

export enum KlageÅrsak {
    FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
    KØET_BEHANDLING = 'KØET_BEHANDLING',
    ANNET = 'ANNET',
}
