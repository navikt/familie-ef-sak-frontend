import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { ResultatVisning } from '../Felles/ResultatVisning';
import { sorterUtAktivitetsvilkår, sorterUtInngangsvilkår } from '../Felles/utils';
import { Heading } from '@navikt/ds-react';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Søknadsdatoer } from '../Overgangsstønad/Søknadsdatoer';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import {
    GråBoks,
    SaksbehanldingsinformasjonUtdanning,
    SaksbehanldingsinformasjonUtgifter,
    SøknadsinformajsonUtdanning,
    SøknadsinformajsonUtgifter,
} from './SaksinformasjonSkolepenger';

const OppsummeringContainer = styled.div<{ åpenHøyremeny: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 1rem 2rem 1rem 2rem;
    gap: 1rem;
    @media only screen and (max-width: ${(p) => (p.åpenHøyremeny ? '1450px' : '1150px')}) {
        flex-wrap: wrap;
    }
`;

const Oppsummeringsboks = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

export const VedtaksoppsummeringSkolepenger: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsvilkår(vilkår);
    const { åpenHøyremeny } = useBehandling();

    const utdanning = vilkår.grunnlag.aktivitet?.underUtdanning;
    const skalViseSøknadsinfo =
        !!utdanning && behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

    return (
        <>
            <OppsummeringContainer åpenHøyremeny={åpenHøyremeny}>
                <Oppsummeringsboks>
                    <Heading spacing size="small" level="5">
                        Vilkårsvurdering
                    </Heading>
                    <ResultatVisning
                        vilkårsvurderinger={inngangsvilkår}
                        tittel="Inngangsvilkår:"
                        stønadstype={behandling.stønadstype}
                    />
                    <ResultatVisning
                        vilkårsvurderinger={aktivitetsvilkår}
                        tittel="Aktivitet:"
                        stønadstype={behandling.stønadstype}
                    />
                </Oppsummeringsboks>
                {skalViseSøknadsdata && (
                    <Oppsummeringsboks>
                        <Søknadsdatoer
                            behandlingId={behandling.id}
                            stønadstype={behandling.stønadstype}
                        />
                    </Oppsummeringsboks>
                )}
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
                {/*<SaksinformasjonSkolepenger vilkår={vilkår} behandling={behandling} />*/}
            </OppsummeringContainer>
        </>
    );
};
