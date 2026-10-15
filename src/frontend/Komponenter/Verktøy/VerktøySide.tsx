import React from 'react';
import { Route, Routes } from 'react-router';
import styled from 'styled-components';
import { SamværskalkulatorSide } from './SamværskalkulatorSide';
import { InntektskalkulatorSide } from './InntektskalkulatorSide';
import { BeregningsskjemaSide } from './BeregningsskjemaSide/BeregningsskjemaSide';

const Container = styled.div`
    margin: 1rem;
`;

export const VerktøySide: React.FC = () => {
    return (
        <Container>
            <Routes>
                <Route path="samvaerskalkulator/*" element={<SamværskalkulatorSide />} />
                <Route path="inntektskalkulator/*" element={<InntektskalkulatorSide />} />
                <Route path="beregningsskjema/*" element={<BeregningsskjemaSide />} />
            </Routes>
        </Container>
    );
};
