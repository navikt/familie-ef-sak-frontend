import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import TidligereVedtakOppsummering from './TidligereVedtakOppsummering';
import { sorterUtTidligereVedtaksvilkår } from '../Felles/utils';
import { Søknadsinformasjon } from '../Felles/Søknadsinformasjon';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { Vilkårsvurdering } from '../Felles/Vilkårsvurdering';

const OppsummeringContainer = styled.div`
    display: flex;
    margin: 1rem 2rem 1rem 2rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

export const VedtaksoppsummeringOvergangsstønad: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const tidligereVedtaksvilkår = sorterUtTidligereVedtaksvilkår(vilkår);

    return (
        <OppsummeringContainer>
            <Vilkårsvurdering vilkår={vilkår} />
            {skalViseSøknadsdata && <Søknadsinformasjon behandlingId={behandling.id} />}
            <TidligereVedtakOppsummering tidligereVedtaksvilkår={tidligereVedtaksvilkår} />
        </OppsummeringContainer>
    );
};
