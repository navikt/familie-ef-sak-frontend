import React, { FC, useCallback, useEffect } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Steg } from '../Høyremeny/Steg';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import AlertStripe from 'nav-frontend-alertstriper';
import { Vedtaksoppsummering } from '../Vilkårresultat/Vedtaksoppsummering';
import VedtakOgBeregningOvergangsstønad from './VedtakOgBeregningOvergangsstønad';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { RessursStatus } from '../../../App/typer/ressurs';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { Behandling } from '../../../App/typer/fagsak';

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
    const { fagsak } = useHentFagsak();

    const { vilkår, hentVilkår } = useHentVilkår();

    const hentVilkårCallback = useCallback(() => {
        hentVilkår(behandlingId);
    }, [behandlingId, hentVilkår]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            console.log(fagsak.data.stønadstype);
        }
    }, [fagsak]);

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
            <Vedtaksoppsummering vilkår={vilkår} behandling={behandling} />
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
            <Vedtaksoppsummering vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningOvergangsstønad behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};
