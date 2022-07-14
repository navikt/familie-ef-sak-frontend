import React, { FC, useCallback, useEffect } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Steg } from '../Høyremeny/Steg';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import AlertStripe from 'nav-frontend-alertstriper';
import { VedtaksoppsummeringOvergangsstønad } from './Overgangsstønad/VedtaksoppsummeringOvergangsstønad';
import VedtakOgBeregningOvergangsstønad from './Overgangsstønad/VedtakOgBeregningOvergangsstønad';
import VedtakOgBeregningBarnetilsyn from './Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { Behandling } from '../../../App/typer/fagsak';
import { VedtaksoppsummeringBarnetilsyn } from './Barnetilsyn/VedtaksoppsummeringBarnetilsyn';
import VedtakOgBeregningSkolepenger from './Skolepenger/VedtakOgBeregningSkolepenger';
import { VedtaksoppsummeringSkolepenger } from './Skolepenger/VedtaksoppsummeringSkolepenger';
import { SaksinformasjonSkolepenger } from './Skolepenger/SaksinformasjonSkolepenger';

const AlertStripeLeft = styled(AlertStripe)`
    margin-left: 2rem;
    margin-top: 1rem;
`;

const AlertStripeIkkeFerdigBehandletVilkår = (): JSX.Element => (
    <AlertStripeLeft type="feil" form="inline">
        <Element>Vedtaksresultat kan ikke settes da et eller flere vilkår er ubehandlet.</Element>
    </AlertStripeLeft>
);

export const VedtakOgBeregningSide: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { behandling } = useBehandling();

    const { vilkår, hentVilkår } = useHentVilkår();

    const hentVilkårCallback = useCallback(() => {
        hentVilkår(behandlingId);
    }, [behandlingId, hentVilkår]);

    useEffect(() => {
        hentVilkårCallback();
    }, [hentVilkårCallback]);
    return (
        <DataViewer response={{ behandling, vilkår }}>
            {({ behandling, vilkår }) => {
                switch (behandling.stønadstype) {
                    case Stønadstype.OVERGANGSSTØNAD:
                        return (
                            <VedtakOgBeregningSideOvergangsstønad
                                behandling={behandling}
                                vilkår={vilkår}
                            />
                        );
                    case Stønadstype.BARNETILSYN:
                        return (
                            <VedtakOgBeregningSideBarnetilsyn
                                behandling={behandling}
                                vilkår={vilkår}
                            />
                        );
                    case Stønadstype.SKOLEPENGER:
                        return (
                            <VedtakOgBeregningSideSkolepenger
                                behandling={behandling}
                                vilkår={vilkår}
                            />
                        );
                }
            }}
        </DataViewer>
    );
};

const VedtakOgBeregningSideOvergangsstønad: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <>
            <VedtaksoppsummeringOvergangsstønad vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningOvergangsstønad behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};

const VedtakOgBeregningSideBarnetilsyn: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <>
            <VedtaksoppsummeringBarnetilsyn vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningBarnetilsyn behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};

const VedtakOgBeregningSideSkolepenger: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <>
            <VedtaksoppsummeringSkolepenger vilkår={vilkår} behandling={behandling} />
            <SaksinformasjonSkolepenger vilkår={vilkår} />

            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningSkolepenger behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};
