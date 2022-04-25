import { TilbakekrevingsbehandlingÅrsak } from './tilbakekreving';

export enum Behandlingsårsak {
    KLAGE = 'KLAGE',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    SANKSJON_1_MND = 'SANKSJON_1_MND',
    SØKNAD = 'SØKNAD',
    MIGRERING = 'MIGRERING',
    KORRIGERING = 'KORRIGERING',
}

export const behandlingsårsakTilTekst: Record<Behandlingsårsak, string> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    KORRIGERING: 'Korrigering',
};

export const behandlingsårsaker: Behandlingsårsak[] = [
    Behandlingsårsak.KLAGE,
    Behandlingsårsak.NYE_OPPLYSNINGER,
    Behandlingsårsak.SANKSJON_1_MND,
    Behandlingsårsak.SØKNAD,
    Behandlingsårsak.KORRIGERING,
];

export const behandlingOgTilbakekrevingsårsakTilTekst: Record<
    Behandlingsårsak | TilbakekrevingsbehandlingÅrsak,
    string
> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    KORRIGERING: 'Korrigering',
    /** De neste er revurderingsårsaker for tilbakekrevingsbehandlinger **/
    REVURDERING_KLAGE_NFP: 'Klage tilbakekreving',
    REVURDERING_KLAGE_KA: 'Klage omgjort av KA',
    REVURDERING_OPPLYSNINGER_OM_VILKÅR: 'Nye opplysninger',
    REVURDERING_OPPLYSNINGER_OM_FORELDELSE: 'Nye opplysninger',
    REVURDERING_FEILUTBETALT_BELØP_HELT_ELLER_DELVIS_BORTFALT:
        'Feilutbetalt beløp helt eller delvis bortfalt',
};
