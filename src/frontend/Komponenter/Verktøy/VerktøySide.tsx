import React from 'react';
import styled from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import { SamværkalkulatorSide } from './SamværkalkulatorSide';

const Container = styled.div`
    padding: 2rem;
`;

export const VerktøySide: React.FC = () => {
    return (
        <Container>
            <Routes>
                <Route path="samver" element={<SamværkalkulatorSide />} />
            </Routes>
        </Container>
    );
};
