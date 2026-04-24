import React, { FC } from 'react';
import { Box, VStack } from '@navikt/ds-react';

export const VedtaksperiodeContainer: FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    return (
        <Box
            background="neutral-soft"
            borderColor="neutral-subtle"
            borderWidth="1"
            padding="space-16"
            width="100%"
        >
            <VStack gap="space-16">{children}</VStack>
        </Box>
    );
};
