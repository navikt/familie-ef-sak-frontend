import React, { FC } from 'react';
import styled from 'styled-components';

export const StyledDiv = styled.div<{ $farge: string }>`
    border-bottom: 2px solid ${({ $farge }) => $farge};
`;

export const Divider: FC<{ farge?: string }> = ({ farge = 'var(--a-gray-900)' }) => {
    return <StyledDiv $farge={farge} />;
};
