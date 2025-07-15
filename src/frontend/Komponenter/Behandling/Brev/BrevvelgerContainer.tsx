import React, { FC } from 'react';
import { VStack } from '@navikt/ds-react';
import styles from './BrevvelgerContainer.module.css';

export const BrevvelgerContainer: FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    return (
        <VStack gap={'4'} className={styles.container}>
            {children}
        </VStack>
    );
};
