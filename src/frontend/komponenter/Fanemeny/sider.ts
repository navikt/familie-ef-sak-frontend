import TidligereVedtaksperioder from '../Behandling/TidligereVedtaksperioder/TidligereVedtaksperioder';
import Personopplysninger from '../Behandling/Personopplysninger/Personopplysninger';
import Inngangsvilkår from '../Behandling/Inngangsvilkår/Inngangsvilkår';
import { FunctionComponent } from 'react';
import Aktivitet from '../Behandling/Aktivitet/Aktivitet';
import Brev from '../Behandling/Brev/Brev';
import Blankett from '../Behandling/Blankett/Blankett';
import VedtakOgBeregning from '../Behandling/VedtakOgBeregning/VedtakOgBeregning';
import { Behandling } from '../../typer/fagsak';
import { Behandlingstype } from '../../typer/behandlingstype';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

export enum SideNavn {
    PERSONOPPLYSNINGER = 'Personopplysninger',
    TIDLIGEREVEDTAKSPERIODER = 'Tidligere vedtaksperioder',
    INNGANGSVILKÅR = 'Inngangsvilkår',
    AKTIVITET = 'Aktivitet',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    BREV = 'Brev',
    BLANKETT = 'Blankett',
}

export const sider: ISide[] = [
    {
        href: 'personopplysninger',
        navn: SideNavn.PERSONOPPLYSNINGER,
        komponent: Personopplysninger,
    },
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
        komponent: VedtakOgBeregning,
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
    return sider.filter((side) => side.navn !== SideNavn.BLANKETT);
};
