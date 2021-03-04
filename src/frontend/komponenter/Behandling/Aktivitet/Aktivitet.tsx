import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
    behandlingId: string;
}

const StyledAktivitet = styled.div`
    margin: 2rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-auto-rows: auto;
    grid-gap: 3rem;
`;

const Aktivitet: FC<Props> = ({ behandlingId }) => {
    return <StyledAktivitet></StyledAktivitet>;
};

export default Aktivitet;
