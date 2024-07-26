import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { filtrerFanerPåBehandlingstype } from './Fanemeny/faner';
import { Behandling } from '../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    const behandlingsfaner = filtrerFanerPåBehandlingstype(behandling);
    return (
        <Routes>
            {behandlingsfaner.map((fane) => (
                <Route
                    key={fane.navn}
                    path={`${fane.href}`}
                    element={React.createElement(fane.komponent, { behandling: behandling }, null)}
                />
            ))}
            <Route path="*" element={<Navigate to={behandlingsfaner[0].href} replace={true} />} />
        </Routes>
    );
};

export default BehandlingRoutes;
