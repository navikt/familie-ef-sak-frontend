import React, { FC, useCallback, useEffect } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Steg } from '../Høyremeny/Steg';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import AlertStripe from 'nav-frontend-alertstriper';
import { Søknadsoppsummering } from '../Vilkårresultat/Søknadsoppsummering';
import VedtakOgBeregning from './VedtakOgBeregning';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';

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
                const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

                return (
                    <>
                        <Søknadsoppsummering
                            vilkår={vilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                            behandlingId={behandlingId}
                        />
                        {behandling.steg === Steg.VILKÅR ? (
                            <AlertStripeIkkeFerdigBehandletVilkår />
                        ) : (
                            <VedtakOgBeregning behandling={behandling} vilkår={vilkår} />
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
