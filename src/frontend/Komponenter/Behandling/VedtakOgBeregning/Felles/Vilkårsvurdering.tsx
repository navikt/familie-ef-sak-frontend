import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { Heading } from '@navikt/ds-react';
import { ResultatVisning } from './ResultatVisning';
import styled from 'styled-components';
import { sorterUtAktivitetsvilkår, sorterUtInngangsvilkår } from './utils';
import { Neutral100 } from '@navikt/ds-tokens/js';

const Container = styled.div`
    padding: 1rem;
    background-color: ${Neutral100};
`;

export const Vilkårsvurdering: React.FC<{
    vilkår: IVilkår;
}> = ({ vilkår }) => {
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsvilkår(vilkår);

    return (
        <Container>
            <Heading spacing size="small">
                Vilkårsvurdering
            </Heading>
            <ResultatVisning vilkårsvurderinger={inngangsvilkår} tittel="Inngangsvilkår:" />
            <ResultatVisning vilkårsvurderinger={aktivitetsvilkår} tittel="Aktivitetsvilkår:" />
        </Container>
    );
};
