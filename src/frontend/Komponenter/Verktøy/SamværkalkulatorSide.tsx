import React from 'react';
import { VStack } from '@navikt/ds-react';
import { SamværKalkulator } from '../../Felles/Kalkulator/SamværKalkulator';

export const SamværkalkulatorSide: React.FC = () => {
    return (
        <VStack gap="4">
            <SamværKalkulator />
        </VStack>
    );
};
