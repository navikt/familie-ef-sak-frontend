import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { SamværskalkulatorSide } from './SamværskalkulatorSide';
import { InntektskalkulatorSide } from './InntektskalkulatorSide';

const Container = styled.div`
    margin: 1rem;
`;

export const VerktøySide: React.FC = () => {
    return (
        <Container>
            <Routes>
                <Route path="samvaerskalkulator/*" element={<SamværskalkulatorSide />} />
                <Route path="inntektskalkulator/*" element={<InntektskalkulatorSide />} />
            </Routes>
        </Container>
    );
};
