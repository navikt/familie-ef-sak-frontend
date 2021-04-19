import React, { FC } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursStatus } from '../../../typer/ressurs';
import { Steg } from '../../Høyremeny/Steg';
import { Søknadsdatoer } from './Søknadsdatoer';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import AlertStripe from 'nav-frontend-alertstriper';
import { VilkårsresultatOppsummering } from '../../Vilkårresultat/VilkårsresultatOppsummering';
import VedtakOgBeregning from './VedtakOgBeregning';

const AlertStripeLeft = styled(AlertStripe)`
    margin-left: 2rem;
`;

export const VedtakOgBeregningSide: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { behandling } = useBehandling();
    if (behandling.status === RessursStatus.SUKSESS && behandling.data.steg === Steg.VILKÅR) {
        return (
            <>
                <VilkårsresultatOppsummering behandlingId={behandlingId} />
                <Søknadsdatoer behandlingId={behandlingId} />
                <AlertStripeLeft type="feil" form="inline">
                    <Element>
                        Vedtaksresultat kan ikke settes da et eller flere vilkår er ubehandlet.
                    </Element>
                </AlertStripeLeft>
            </>
        );
    }
    return (
        <>
            <VilkårsresultatOppsummering behandlingId={behandlingId} />
            <Søknadsdatoer behandlingId={behandlingId} />
            <VedtakOgBeregning behandlingId={behandlingId} />
        </>
    );
};
