import React from 'react';
import { Button, HStack } from '@navikt/ds-react';

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
    <HStack gap="4">
        <Button onClick={startVilkårsredigering} variant={'secondary'} type={'button'}>
            {venstreKnappetekst ? venstreKnappetekst : 'Vurder vilkår'}
        </Button>
        <Button onClick={håndterIkkeVurderVilkår} variant={'tertiary'} type={'button'}>
            {høyreKnappetekst ? høyreKnappetekst : 'Ikke vurder vilkår'}
        </Button>
        {skalViseGjenbrukKnapp && (
            <Button onClick={gjenbrukVilkårsvurdering} variant={'tertiary'} type={'button'}>
                Gjenbruk
            </Button>
        )}
    </HStack>
);
