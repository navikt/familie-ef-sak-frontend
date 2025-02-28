import React from 'react';
import { SamværskalkulatorSide } from './SamværskalkulatorSide';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    margin: 1rem;
`;

export const VerktøySide: React.FC = () => {
    return (
        <Container>
            <Routes>
                <Route path="samvaerskalkulator" element={<SamværskalkulatorSide prop={''} />} />
            </Routes>
        </Container>
    );
};
