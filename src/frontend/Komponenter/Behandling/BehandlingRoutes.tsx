import { Routes, Navigate, Route } from 'react-router-dom';
import * as React from 'react';
import { filtrerSiderEtterBehandlingstype, sider } from './Fanemeny/sider';
import { useBehandling } from '../../App/context/BehandlingContext';
import { RessursSuksess } from '../../App/typer/ressurs';
import { Behandling } from '../../App/typer/fagsak';

const BehandlingRoutes: React.FC = () => {
    const { behandling } = useBehandling();
    const behandlingSuksess = behandling as RessursSuksess<Behandling>;

    return (
        <Routes>
            <Route
                path="/behandling/:behandlingId/"
                element={<Navigate to="/behandling/:behandlingId/tidligere-vedtaksperioder" />}
            />
            {filtrerSiderEtterBehandlingstype(sider, behandlingSuksess.data).map((side) => (
                <Route key={side.navn} path={`/behandling/:behandlingId/${side.href}`}>
                    {React.createElement(
                        side.komponent,
                        { behandlingId: behandlingSuksess.data.id },
                        null
                    )}
                </Route>
            ))}
        </Routes>
    );
};

export default BehandlingRoutes;
