import React from 'react';
import { Button } from '@navikt/ds-react';
import styled from 'styled-components';

const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const Knapp = styled(Button)`
    margin-right: 1rem;
`;

interface Props {
    skalViseGjenbrukKnapp: boolean;
    håndterIkkeVurderVilkår: () => void;
    startVilkårsredigering: () => void;
    gjenbrukVilkårsvurdering: () => void;
    venstreKnappetekst?: string;
    høyreKnappetekst?: string;
}

export const IkkePåstartetVurdering: React.FC<Props> = ({
    skalViseGjenbrukKnapp,
    håndterIkkeVurderVilkår,
    startVilkårsredigering,
    gjenbrukVilkårsvurdering,
    venstreKnappetekst,
    høyreKnappetekst,
}) => (
    <KnappWrapper>
        <Knapp onClick={startVilkårsredigering} variant={'secondary'} type={'button'}>
            {venstreKnappetekst ? venstreKnappetekst : 'Vurder vilkår'}
        </Knapp>
        <Button onClick={håndterIkkeVurderVilkår} variant={'tertiary'} type={'button'}>
            {høyreKnappetekst ? høyreKnappetekst : 'Ikke vurder vilkår'}
        </Button>
        {skalViseGjenbrukKnapp && (
            <Button onClick={gjenbrukVilkårsvurdering} variant={'tertiary'} type={'button'}>
                Gjenbruk
            </Button>
        )}
    </KnappWrapper>
);
