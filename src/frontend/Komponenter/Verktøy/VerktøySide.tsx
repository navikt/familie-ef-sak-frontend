import React from 'react';
import styled from 'styled-components';
import { SamværKalkulator } from '../../Felles/Kalkulator/SamværKalkulator';

const Container = styled.div`
    margin: 1.5rem;
`;

export const VerktøySide: React.FC = () => {
    return (
        <Container>
            <SamværKalkulator />
        </Container>
    );
};
