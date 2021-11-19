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

const Container = styled.div`
    max-width: 1180px;
`;

const InnerContainer = styled.div`
    padding: 1rem;
`;

export const VilkårsresultatOppsummering: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsVilkår(vilkår);
    const tidligereVedtaksvilkår = sorterUtTidligereVedtaksvilkår(vilkår);

    return (
        <Container>
            <InnerContainer>
                <TidligereVedtakOppsummering tidligereVedtaksvilkår={tidligereVedtaksvilkår} />
                <ResultatVisning vilkårsvurderinger={inngangsvilkår} tittel="Inngangsvilkår" />
                <ResultatVisning vilkårsvurderinger={aktivitetsvilkår} tittel="Aktivitet" />
            </InnerContainer>
        </Container>
    );
};
