import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Søknadsinformasjon } from '../Felles/Søknadsinformasjon';
import {
    GråBoks,
    SaksbehanldingsinformasjonUtdanning,
    SaksbehanldingsinformasjonUtgifter,
    SøknadsinformajsonUtdanning,
    SøknadsinformajsonUtgifter,
} from './SaksinformasjonSkolepenger';
import { Vilkårsvurdering } from '../Felles/Vilkårsvurdering';

const OppsummeringContainer = styled.div<{ åpenHøyremeny: boolean }>`
    display: flex;
    margin: 1rem 2rem 1rem 2rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

export const VedtaksoppsummeringSkolepenger: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const { åpenHøyremeny } = useBehandling();

    const utdanning = vilkår.grunnlag.aktivitet?.underUtdanning;
    const skalViseSøknadsinfo =
        !!utdanning && behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

    return (
        <>
            <OppsummeringContainer åpenHøyremeny={åpenHøyremeny}>
                <Vilkårsvurdering vilkår={vilkår} />
                {skalViseSøknadsdata && <Søknadsinformasjon behandlingId={behandling.id} />}
            </OppsummeringContainer>
            <OppsummeringContainer åpenHøyremeny={true}>
                <GråBoks>
                    <SøknadsinformajsonUtdanning
                        utdanning={utdanning}
                        skalViseSøknadsinfo={skalViseSøknadsinfo}
                    />
                    <SaksbehanldingsinformasjonUtdanning vilkår={vilkår} />
                </GråBoks>
                <GråBoks>
                    <SøknadsinformajsonUtgifter
                        utdanning={utdanning}
                        skalViseSøknadsinfo={skalViseSøknadsinfo}
                    />
                    <SaksbehanldingsinformasjonUtgifter vilkår={vilkår} />
                </GråBoks>
            </OppsummeringContainer>
        </>
    );
};
