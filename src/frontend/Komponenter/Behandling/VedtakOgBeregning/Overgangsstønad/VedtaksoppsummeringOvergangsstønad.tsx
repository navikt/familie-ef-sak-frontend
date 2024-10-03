import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import TidligereVedtaksperioder from './TidligereVedtaksperioder';
import { sorterUtTidligereVedtaksvilkår } from '../Felles/utils';
import { Søknadsinformasjon } from '../Felles/Søknadsinformasjon';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/behandlingsårsak';
import { Vilkårsvurdering } from '../Felles/Vilkårsvurdering';

const OppsummeringContainer = styled.div`
    display: flex;
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
            <TidligereVedtaksperioder tidligereVedtaksvilkår={tidligereVedtaksvilkår} />
        </OppsummeringContainer>
    );
};
