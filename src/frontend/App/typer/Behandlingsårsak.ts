import { TilbakekrevingsbehandlingÅrsak } from './tilbakekreving';
import { KlageHenlagtÅrsak, KlageÅrsak } from './klage';

export enum Behandlingsårsak {
    KLAGE = 'KLAGE',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    SANKSJON_1_MND = 'SANKSJON_1_MND',
    SØKNAD = 'SØKNAD',
    MIGRERING = 'MIGRERING',
    G_OMREGNING = 'G_OMREGNING',
    IVERKSETTE_KA_VEDTAK = 'IVERKSETTE_KA_VEDTAK',
    KORRIGERING_UTEN_BREV = 'KORRIGERING_UTEN_BREV',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
    MANUELT_OPPRETTET = 'MANUELT_OPPRETTET',
    SATSENDRING = 'SATSENDRING',
}

export const behandlingsårsakTilTekst: Record<Behandlingsårsak, string> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    G_OMREGNING: 'G-omregning',
    IVERKSETTE_KA_VEDTAK: 'Iverksette KA-vedtak (uten brev)',
    KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
    PAPIRSØKNAD: 'Papirsøknad',
    MANUELT_OPPRETTET: 'Manuelt opprettet',
    SATSENDRING: 'Satsendring',
};

export const behandlingsårsakerForRevurdering: Behandlingsårsak[] = [
    Behandlingsårsak.KLAGE,
    Behandlingsårsak.NYE_OPPLYSNINGER,
    Behandlingsårsak.SANKSJON_1_MND,
    Behandlingsårsak.SØKNAD,
    Behandlingsårsak.PAPIRSØKNAD,
    Behandlingsårsak.G_OMREGNING,
    Behandlingsårsak.IVERKSETTE_KA_VEDTAK,
    Behandlingsårsak.KORRIGERING_UTEN_BREV,
    Behandlingsårsak.SATSENDRING,
];

export const behandlingOgTilbakekrevingsårsakTilTekst: Record<
    Behandlingsårsak | TilbakekrevingsbehandlingÅrsak | KlageÅrsak,
    string
> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    G_OMREGNING: 'G-omregning',
    SATSENDRING: 'Satsendring',
    IVERKSETTE_KA_VEDTAK: 'Iverksette KA-vedtak (uten brev)',
    KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
    PAPIRSØKNAD: 'Papirsøknad',
    MANUELT_OPPRETTET: 'Manuelt opprettet',
    /** De neste er revurderingsårsaker for tilbakekrevingsbehandlinger **/
    REVURDERING_KLAGE_NFP: 'Klage tilbakekreving',
    REVURDERING_KLAGE_KA: 'Klage omgjort av KA',
    REVURDERING_OPPLYSNINGER_OM_VILKÅR: 'Nye opplysninger',
    REVURDERING_OPPLYSNINGER_OM_FORELDELSE: 'Nye opplysninger',
    REVURDERING_FEILUTBETALT_BELØP_HELT_ELLER_DELVIS_BORTFALT:
        'Feilutbetalt beløp helt eller delvis bortfalt',
    FEIL_I_LOVANDVENDELSE: 'Feil i lovanvendelse',
    FEIL_REGELVERKSFORSTÅELSE: 'Feil regelverkforståelse',
    FEIL_ELLER_ENDRET_FAKTA: 'Feil eller endret fakta',
    FEIL_PROSESSUELL: 'Feil prosessuell',
    KØET_BEHANDLING: 'Køet behandling',
    ANNET: 'Annet',
};

export enum EHenlagtårsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
}

export const henlagtÅrsakTilTekst: Record<EHenlagtårsak | KlageHenlagtÅrsak, string> = {
    TRUKKET_TILBAKE: 'Trukket tilbake',
    FEILREGISTRERT: 'Feilregistrert',
};
