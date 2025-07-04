import React, { FC } from 'react';
import { VStack } from '@navikt/ds-react';
import styles from './VedtaksperiodeContainer.module.css';

export const VedtaksperiodeContainer: FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    return (
        <VStack gap={'4'} className={styles.container}>
            {children}
        </VStack>
    );
};
