import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { Søknadsinformasjon } from '../Felles/Søknadsinformasjon';
import {
    SøknadsinformasjonUtdanning,
    SøknadsinformajsonUtgifter,
} from './SaksinformasjonSkolepenger';
import { Vilkårsvurdering } from '../Felles/Vilkårsvurdering';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FlexRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

export const VedtaksoppsummeringSkolepenger: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const utdanning = vilkår.grunnlag.aktivitet?.underUtdanning;
    const skalViseSøknadsinfo =
        !!utdanning && behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

    return (
        <Container>
            <FlexRow>
                <Vilkårsvurdering vilkår={vilkår} />
                {skalViseSøknadsdata && <Søknadsinformasjon behandlingId={behandling.id} />}
            </FlexRow>
            <FlexRow>
                <SøknadsinformasjonUtdanning
                    skalViseSøknadsinfo={skalViseSøknadsinfo}
                    utdanning={utdanning}
                    vilkår={vilkår}
                />
                <SøknadsinformajsonUtgifter
                    skalViseSøknadsinfo={skalViseSøknadsinfo}
                    utdanning={utdanning}
                    vilkår={vilkår}
                />
            </FlexRow>
        </Container>
    );
};
