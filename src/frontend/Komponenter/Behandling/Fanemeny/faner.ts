import { FunctionComponent } from 'react';
import { Behandling, BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { AktivitetsvilkårFane } from '../Aktivitet/AktivitetsvilkårFane';
import { BrevFane } from '../Brev/BrevFane';
import { InngangsvilkårFane } from '../Inngangsvilkår/InngangsvilkårFane';
import { KorrigeringFane } from './KorrigeringFane';
import { SanksjonsfastsettelseFane } from '../Sanksjon/SanksjonsfastsettelseFane';
import { SimuleringFane } from '../Simulering/SimuleringFane';
import { TidligereVedtaksperioderFane } from '../TidligereVedtaksperioder/TidligereVedtaksperioderFane';
import { VedtakOgBeregningFane } from '../VedtakOgBeregning/VedtakOgBeregningFane';
import { AarsakRevurderingFane } from '../ÅrsakRevurdering/ÅrsakRevurderingFane';

export interface FaneProps {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandling: Behandling }>;
}

export enum FaneNavn {
    AKTIVITET = 'Aktivitet',
    BREV = 'Vedtaksbrev',
    KORRIGERING_UTEN_BREV = 'Korrigering uten brev',
    IVERKSETTE_KA_VEDTAK = 'Iverksette KA-vedtak (uten brev)',
    INNGANGSVILKÅR = 'Inngangsvilkår',
    SIMULERING = 'Simulering',
    SANKSJON = 'Sanksjonsfastsettelse',
    TIDLIGEREVEDTAKSPERIODER = 'Tidligere vedtaksperioder',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    ÅRSAK_REVURDERING = 'Årsak revurdering',
}

const alleFaner: FaneProps[] = [
    {
        href: 'arsak-revurdering',
        navn: FaneNavn.ÅRSAK_REVURDERING,
        komponent: AarsakRevurderingFane,
    },
    {
        href: 'tidligere-vedtaksperioder',
        navn: FaneNavn.TIDLIGEREVEDTAKSPERIODER,
        komponent: TidligereVedtaksperioderFane,
    },
    {
        href: 'inngangsvilkar',
        navn: FaneNavn.INNGANGSVILKÅR,
        komponent: InngangsvilkårFane,
    },
    {
        href: 'aktivitet',
        navn: FaneNavn.AKTIVITET,
        komponent: AktivitetsvilkårFane,
    },
    {
        href: 'vedtak-og-beregning',
        navn: FaneNavn.VEDTAK_OG_BEREGNING,
        komponent: VedtakOgBeregningFane,
    },
    {
        href: 'sanksjonsfastsettelse',
        navn: FaneNavn.SANKSJON,
        komponent: SanksjonsfastsettelseFane,
    },
    {
        href: 'simulering',
        navn: FaneNavn.SIMULERING,
        komponent: SimuleringFane,
    },
    {
        href: 'brev',
        navn: FaneNavn.BREV,
        komponent: BrevFane,
    },
    {
        href: 'brev',
        navn: FaneNavn.KORRIGERING_UTEN_BREV || FaneNavn.IVERKSETTE_KA_VEDTAK,
        komponent: KorrigeringFane,
    },
];

export const fanerForStønad = (stønadstype: Stønadstype): FaneProps[] => {
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return alleFaner;
        case Stønadstype.BARNETILSYN:
        case Stønadstype.SKOLEPENGER:
            return alleFaner.filter((fane) => fane.navn !== FaneNavn.TIDLIGEREVEDTAKSPERIODER);
        default:
            return alleFaner;
    }
};

const filtrerHvisSanksjon = [FaneNavn.SANKSJON, FaneNavn.SIMULERING, FaneNavn.BREV];

const filtrerHvisMigrering = [FaneNavn.VEDTAK_OG_BEREGNING];

const filtrerHvisGOmregningEllerSatsendring = [
    FaneNavn.VEDTAK_OG_BEREGNING,
    FaneNavn.SIMULERING,
    FaneNavn.KORRIGERING_UTEN_BREV,
    FaneNavn.IVERKSETTE_KA_VEDTAK,
];

const filtrerVekkHvisStandard = [
    FaneNavn.SANKSJON,
    FaneNavn.KORRIGERING_UTEN_BREV,
    FaneNavn.IVERKSETTE_KA_VEDTAK,
];

const filtrerVekkHvisBehandlingsårsakUtenBrev = [FaneNavn.SANKSJON, FaneNavn.BREV];

const filtrerVekkÅrsakRevurderingHvisIkkeRevurdering = (fane: FaneProps, behandling: Behandling) =>
    fane.navn !== FaneNavn.ÅRSAK_REVURDERING || behandling.type === Behandlingstype.REVURDERING;

const ikkeVisBrevHvisHenlagt = (behandling: Behandling, fane: FaneProps) =>
    behandling.resultat !== BehandlingResultat.HENLAGT || fane.navn !== FaneNavn.BREV;

export const filtrerFanerPåBehandlingstype = (behandling: Behandling): FaneProps[] => {
    const faner = fanerForStønad(behandling.stønadstype).filter((fane) =>
        ikkeVisBrevHvisHenlagt(behandling, fane)
    );
    if (
        behandling.type === Behandlingstype.REVURDERING &&
        behandling.behandlingsårsak === Behandlingsårsak.SANKSJON_1_MND
    ) {
        return faner.filter((fane) => filtrerHvisSanksjon.includes(fane.navn as FaneNavn));
    }
    if (behandling.behandlingsårsak === Behandlingsårsak.MIGRERING) {
        return faner.filter((fane) => filtrerHvisMigrering.includes(fane.navn as FaneNavn));
    }
    if (
        behandling.behandlingsårsak === Behandlingsårsak.G_OMREGNING ||
        behandling.behandlingsårsak === Behandlingsårsak.SATSENDRING
    ) {
        return faner.filter((fane) =>
            filtrerHvisGOmregningEllerSatsendring.includes(fane.navn as FaneNavn)
        );
    }

    if (
        behandling.behandlingsårsak === Behandlingsårsak.KORRIGERING_UTEN_BREV ||
        behandling.behandlingsårsak === Behandlingsårsak.IVERKSETTE_KA_VEDTAK
    ) {
        return faner
            .filter(
                (fane) => !filtrerVekkHvisBehandlingsårsakUtenBrev.includes(fane.navn as FaneNavn)
            )
            .filter((fane) => filtrerVekkÅrsakRevurderingHvisIkkeRevurdering(fane, behandling));
    }

    return faner
        .filter((fane) => !filtrerVekkHvisStandard.includes(fane.navn as FaneNavn))
        .filter((fane) => filtrerVekkÅrsakRevurderingHvisIkkeRevurdering(fane, behandling));
};
