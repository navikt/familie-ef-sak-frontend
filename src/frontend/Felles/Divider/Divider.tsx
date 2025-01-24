import React, { FC } from 'react';
import styled from 'styled-components';
import { AGray900 } from '@navikt/ds-tokens/dist/tokens';

export const StyledDiv = styled.div<{ $farge: string }>`
    border-bottom: 2px solid ${({ $farge }) => $farge};
`;

export const Divider: FC<{ farge?: string }> = ({ farge = `${AGray900}` }) => {
    return <StyledDiv $farge={farge} />;
};
