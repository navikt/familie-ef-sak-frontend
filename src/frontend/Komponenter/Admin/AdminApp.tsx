import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import { JournalforingAdmin } from '../Journalforing/JournalforingAdmin';

export const AdminApp: React.FC = () => {
    return (
        <Routes>
            <Route
                path={`/ny-behandling-for-ferdigstilt-journalpost/:journalpostid`}
                element={<JournalforingAdmin />}
            />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    );
};
