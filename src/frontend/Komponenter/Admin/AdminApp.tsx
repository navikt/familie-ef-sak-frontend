import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import { JournalføringAdmin } from '../Journalføring/JournalføringAdmin';
import { JournalføringAdminVelger } from '../Journalføring/JournalføringAdminVelger';
import GamleBehandlinger from '../Behandling/GamleBehandlinger/GamleBehandlinger';

export const AdminApp: React.FC = () => {
    return (
        <Routes>
            <Route
                path={`/ny-behandling-for-ferdigstilt-journalpost/:journalpostid`}
                element={<JournalføringAdmin />}
            />
            <Route
                path={`/ny-behandling-for-ferdigstilt-journalpost`}
                element={<JournalføringAdminVelger />}
            />
            <Route path={`/gamle-behandlinger`} element={<GamleBehandlinger />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    );
};
