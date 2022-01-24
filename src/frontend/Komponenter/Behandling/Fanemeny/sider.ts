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

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

export enum SideNavn {
    TIDLIGEREVEDTAKSPERIODER = 'Tidligere vedtaksperioder',
    INNGANGSVILKÅR = 'Inngangsvilkår',
    AKTIVITET = 'Aktivitet',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    SIMULERING = 'Simulering',
    BREV = 'Brev',
    BLANKETT = 'Blankett',
}

const vedtakOgBeregning: ISide = {
    href: 'vedtak-og-beregning',
    navn: SideNavn.VEDTAK_OG_BEREGNING,
    komponent: VedtakOgBeregningSide,
};

export const sider: ISide[] = [
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
    vedtakOgBeregning,
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
        href: 'blankett',
        navn: SideNavn.BLANKETT,
        komponent: Blankett,
    },
];

export const filtrerSiderEtterBehandlingstype = (
    sider: ISide[],
    behandling: Behandling
): ISide[] => {
    if (behandling.type === Behandlingstype.BLANKETT) {
        return sider.filter((side) => side.navn !== SideNavn.BREV);
    }
    if (behandling.behandlingsårsak === Behandlingsårsak.MIGRERING) {
        return [vedtakOgBeregning];
    }
    return sider.filter((side) => side.navn !== SideNavn.BLANKETT);
};
