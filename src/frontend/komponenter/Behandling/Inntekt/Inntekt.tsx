import React, { FC, useState } from 'react';
import styled from 'styled-components';

interface Props {
    behandlingId: string;
}

const StyledInntekt = styled.div`
    padding: 2rem;
`;

const Inntekt: FC<Props> = ({ behandlingId }) => {
    return (
        <StyledInntekt>
            <h2>Inntekt</h2>
        </StyledInntekt>
    );
};

export default Inntekt;
