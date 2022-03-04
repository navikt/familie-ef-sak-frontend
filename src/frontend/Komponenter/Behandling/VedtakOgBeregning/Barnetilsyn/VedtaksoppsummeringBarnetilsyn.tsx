import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { Behandling } from '../../../../App/typer/fagsak';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Heading } from '@navikt/ds-react';
import { ResultatVisning } from '../../Vilkårresultat/ResultatVisning';
import { sorterUtBarnetilsynsvilkår, sorterUtInngangsvilkår } from '../../Vilkårresultat/utils';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { Søknadsdatoer } from '../Overgangsstønad/Søknadsdatoer';

const OppsummeringContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-right: 0.5rem;
    flex-wrap: wrap;
`;

const Oppsummeringsboks = styled.div`
    margin: 1rem;
    margin-right: 0.5rem;
    padding: 1rem;
    background-color: ${navFarger.navGraBakgrunn};
`;

export const VedtaksoppsummeringBarnetilsyn: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const barnetilsynsvilkår = sorterUtBarnetilsynsvilkår(vilkår);

    return (
        <OppsummeringContainer>
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
                    vilkårsvurderinger={barnetilsynsvilkår}
                    tittel="Barnetilsynsvilkår:"
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
    );
};
