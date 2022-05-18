import TidligereVedtaksperioder from '../TidligereVedtaksperioder/TidligereVedtaksperioder';
import Inngangsvilkår from '../Inngangsvilkår/Inngangsvilkår';
import { FunctionComponent } from 'react';
import Aktivitet from '../Aktivitet/Aktivitetsvilkår';
import Brev from '../Brev/Brev';
import Blankett from '../Blankett/Blankett';
import { Behandling } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { VedtakOgBeregningSide } from '../VedtakOgBeregning/VedtakOgBeregningSide';
import { Simulering } from '../Simulering/Simulering';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import Sanksjonsfastsettelse from '../Sanksjon/Sanksjonsfastsettelse';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import KorrigeringUtenBrev from './KorrigeringUtenBrev';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

export enum SideNavn {
    AKTIVITET = 'Aktivitet',
    BLANKETT = 'Blankett',
    BREV = 'Vedtaksbrev',
    KORRIGERING_UTEN_BREV = 'Korrigering uten brev',
    INNGANGSVILKÅR = 'Inngangsvilkår',
    SIMULERING = 'Simulering',
    SANKSJON = 'Sanksjonsfastsettelse',
    TIDLIGEREVEDTAKSPERIODER = 'Tidligere vedtaksperioder',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
}

const alleSider: ISide[] = [
    {
        href: 'tidligere-vedtaksperioder',
        navn: SideNavn.TIDLIGEREVEDTAKSPERIODER,
        komponent: TidligereVedtaksperioder,
    },
    {
        href: 'inngangsvilkar',
        navn: SideNavn.INNGANGSVILKÅR,
        komponent: Inngangsvilkår,
    },
    {
        href: 'aktivitet',
        navn: SideNavn.AKTIVITET,
        komponent: Aktivitet,
    },
    {
        href: 'vedtak-og-beregning',
        navn: SideNavn.VEDTAK_OG_BEREGNING,
        komponent: VedtakOgBeregningSide,
    },
    {
        href: 'sanksjonsfastsettelse',
        navn: SideNavn.SANKSJON,
        komponent: Sanksjonsfastsettelse,
    },
    {
        href: 'simulering',
        navn: SideNavn.SIMULERING,
        komponent: Simulering,
    },
    {
        href: 'brev',
        navn: SideNavn.BREV,
        komponent: Brev,
    },
    {
        href: 'brev',
        navn: SideNavn.KORRIGERING_UTEN_BREV,
        komponent: KorrigeringUtenBrev,
    },
    {
        href: 'blankett',
        navn: SideNavn.BLANKETT,
        komponent: Blankett,
    },
];

export const siderForStønad = (stønadstype: Stønadstype): ISide[] => {
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return alleSider;
        case Stønadstype.BARNETILSYN:
            return alleSider.filter((side) => side.navn !== SideNavn.TIDLIGEREVEDTAKSPERIODER);
        case Stønadstype.SKOLEPENGER:
            return alleSider;
        default:
            return alleSider;
    }
};

const filtrerVekkHvisBlankett = [SideNavn.BREV, SideNavn.SANKSJON];
const filtrerVekkHvisSanksjon = [
    SideNavn.TIDLIGEREVEDTAKSPERIODER,
    SideNavn.INNGANGSVILKÅR,
    SideNavn.AKTIVITET,
    SideNavn.VEDTAK_OG_BEREGNING,
    SideNavn.BLANKETT,
];
const filtrerHvisMigrering = [SideNavn.VEDTAK_OG_BEREGNING];
const filtrerHvisGOmregning = [SideNavn.VEDTAK_OG_BEREGNING, SideNavn.SIMULERING];
const filtrerVekkHvisStandard = [
    SideNavn.BLANKETT,
    SideNavn.SANKSJON,
    SideNavn.KORRIGERING_UTEN_BREV,
];
const filtrerVekkHvisKorrigeringUtenBrev = [SideNavn.BLANKETT, SideNavn.SANKSJON, SideNavn.BREV];

export const filtrerSiderEtterBehandlingstype = (behandling: Behandling): ISide[] => {
    const sider = siderForStønad(behandling.stønadstype);
    if (behandling.type === Behandlingstype.BLANKETT) {
        return sider.filter((side) => !filtrerVekkHvisBlankett.includes(side.navn as SideNavn));
    }
    if (
        behandling.type === Behandlingstype.REVURDERING &&
        behandling.behandlingsårsak === Behandlingsårsak.SANKSJON_1_MND
    ) {
        return sider.filter((side) => !filtrerVekkHvisSanksjon.includes(side.navn as SideNavn));
    }
    if (behandling.behandlingsårsak === Behandlingsårsak.MIGRERING) {
        return sider.filter((side) => filtrerHvisMigrering.includes(side.navn as SideNavn));
    }
    if (behandling.behandlingsårsak == Behandlingsårsak.G_OMREGNING) {
        return sider.filter((side) => filtrerHvisGOmregning.includes(side.navn as SideNavn));
    }
    if (behandling.behandlingsårsak === Behandlingsårsak.KORRIGERING_UTEN_BREV) {
        return sider.filter(
            (side) => !filtrerVekkHvisKorrigeringUtenBrev.includes(side.navn as SideNavn)
        );
    }
    return sider.filter((side) => !filtrerVekkHvisStandard.includes(side.navn as SideNavn));
};
