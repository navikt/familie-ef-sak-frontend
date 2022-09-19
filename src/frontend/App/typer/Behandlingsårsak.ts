import { TilbakekrevingsbehandlingÅrsak } from './tilbakekreving';
import { KlageÅrsak } from './klage';

export enum Behandlingsårsak {
    KLAGE = 'KLAGE',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    SANKSJON_1_MND = 'SANKSJON_1_MND',
    SØKNAD = 'SØKNAD',
    MIGRERING = 'MIGRERING',
    G_OMREGNING = 'G_OMREGNING',
    KORRIGERING_UTEN_BREV = 'KORRIGERING_UTEN_BREV',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
}

export const behandlingsårsakTilTekst: Record<Behandlingsårsak, string> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    G_OMREGNING: 'G-omregning',
    KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
    PAPIRSØKNAD: 'Papirsøknad',
};

export const behandlingsårsaker: Behandlingsårsak[] = [
    Behandlingsårsak.KLAGE,
    Behandlingsårsak.NYE_OPPLYSNINGER,
    Behandlingsårsak.SANKSJON_1_MND,
    Behandlingsårsak.SØKNAD,
    Behandlingsårsak.G_OMREGNING,
    Behandlingsårsak.KORRIGERING_UTEN_BREV,
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
    KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
    PAPIRSØKNAD: 'Papirsøknad',
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

export const henlagtÅrsakTilTekst: Record<EHenlagtårsak, string> = {
    TRUKKET_TILBAKE: 'Trukket tilbake',
    FEILREGISTRERT: 'Feilregistrert',
};
