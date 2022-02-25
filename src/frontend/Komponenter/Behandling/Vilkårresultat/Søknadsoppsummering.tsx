import React from 'react';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { ResultatVisning } from './ResultatVisning';
import TidligereVedtakOppsummering from './TidligereVedtakOppsummering';
import {
    sorterUtAktivitetsVilkår,
    sorterUtInngangsvilkår,
    sorterUtTidligereVedtaksvilkår,
} from './utils';
import { Søknadsdatoer } from '../VedtakOgBeregning/Søknadsdatoer';
import { Heading } from '@navikt/ds-react';

const OppsummeringContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-right: 0.5rem;
    @media only screen and (max-width: 1450px) {
        flex-wrap: wrap;
    }
`;

const Oppsummeringsboks = styled.div`
    margin: 1rem;
    margin-right: 0.5rem;
    padding: 1rem;
    background-color: #f7f7f7;
`;

export const Søknadsoppsummering: React.FC<{
    vilkår: IVilkår;
    behandlingId: string;
}> = ({ vilkår, behandlingId }) => {
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsVilkår(vilkår);
    const tidligereVedtaksvilkår = sorterUtTidligereVedtaksvilkår(vilkår);

    return (
        <OppsummeringContainer>
            <Oppsummeringsboks>
                <Heading spacing size="small" level="5">
                    Vilkårsvurdering
                </Heading>
                <ResultatVisning vilkårsvurderinger={inngangsvilkår} tittel="Inngangsvilkår:" />
                <ResultatVisning vilkårsvurderinger={aktivitetsvilkår} tittel="Aktivitet:" />
            </Oppsummeringsboks>
            <Oppsummeringsboks>
                <Søknadsdatoer behandlingId={behandlingId} />
            </Oppsummeringsboks>
            <Oppsummeringsboks>
                <TidligereVedtakOppsummering tidligereVedtaksvilkår={tidligereVedtaksvilkår} />
            </Oppsummeringsboks>
        </OppsummeringContainer>
    );
};
