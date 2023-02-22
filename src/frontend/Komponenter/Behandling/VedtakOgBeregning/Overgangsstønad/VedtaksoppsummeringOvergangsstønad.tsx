import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { ResultatVisning } from '../Felles/ResultatVisning';
import TidligereVedtakOppsummering from '../Felles/TidligereVedtakOppsummering';
import {
    sorterUtAktivitetsvilkår,
    sorterUtInngangsvilkår,
    sorterUtTidligereVedtaksvilkår,
} from '../Felles/utils';
import { Søknadsdatoer } from './Søknadsdatoer';
import { Heading } from '@navikt/ds-react';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

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

export const VedtaksoppsummeringOvergangsstønad: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsvilkår(vilkår);
    const tidligereVedtaksvilkår = sorterUtTidligereVedtaksvilkår(vilkår);
    const { åpenHøyremeny } = useBehandling();

    return (
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
            <Oppsummeringsboks>
                <TidligereVedtakOppsummering tidligereVedtaksvilkår={tidligereVedtaksvilkår} />
            </Oppsummeringsboks>
        </OppsummeringContainer>
    );
};
