import React from 'react';
import { SamværskalkulatorSide } from './SamværskalkulatorSide';
import { Route, Routes } from 'react-router-dom';

export const VerktøySide: React.FC = () => {
    return (
        <Routes>
            <Route path="samvaerskalkulator" element={<SamværskalkulatorSide prop={''} />} />
        </Routes>
    );
};
