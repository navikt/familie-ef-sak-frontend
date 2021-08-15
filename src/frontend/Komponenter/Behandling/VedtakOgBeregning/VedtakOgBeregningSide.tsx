import React, { FC } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Steg } from '../Høyremeny/Steg';
import { Søknadsdatoer } from './Søknadsdatoer';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import AlertStripe from 'nav-frontend-alertstriper';
import { VilkårsresultatOppsummering } from '../Vilkårresultat/VilkårsresultatOppsummering';
import VedtakOgBeregning from './VedtakOgBeregning';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

const AlertStripeLeft = styled(AlertStripe)`
    margin-left: 2rem;
`;

const AlertStripeIkkeFerdigBehandletVilkår = (): JSX.Element => (
    <AlertStripeLeft type="feil" form="inline">
        <Element>Vedtaksresultat kan ikke settes da et eller flere vilkår er ubehandlet.</Element>
    </AlertStripeLeft>
);

export const VedtakOgBeregningSide: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { behandling } = useBehandling();

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <>
                    <VilkårsresultatOppsummering behandlingId={behandlingId} />
                    <Søknadsdatoer behandlingId={behandlingId} />
                    {behandling.steg === Steg.VILKÅR ? (
                        <AlertStripeIkkeFerdigBehandletVilkår />
                    ) : (
                        <VedtakOgBeregning behandling={behandling} />
                    )}
                </>
            )}
        </DataViewer>
    );
};
