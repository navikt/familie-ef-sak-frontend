import React from 'react';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    IVilkår,
    TidligereVedtaksperioderType,
} from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { ResultatVisning } from './ResultatVisning';
import TidligereVedtakOppsummering from './TidligereVedtakOppsummering';

const Container = styled.div`
    max-width: 1180px;
`;

const InnerContainer = styled.div`
    padding: 1rem;
`;

export const VilkårsresultatOppsummering: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const inngangsvilkår = vilkår.vurderinger.filter((v) => v.vilkårType in InngangsvilkårType);
    const aktivitetsvilkår = vilkår.vurderinger.filter((v) => v.vilkårType in AktivitetsvilkårType);
    const tidligereVedtaksvilkår = vilkår.vurderinger.filter(
        (v) => v.vilkårType in TidligereVedtaksperioderType
    );

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
