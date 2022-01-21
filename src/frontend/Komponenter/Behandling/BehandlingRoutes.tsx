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
            {filtrerSiderEtterBehandlingstype(sider, behandlingSuksess.data).map((side) => (
                <Route
                    key={side.navn}
                    path={`${side.href}`}
                    element={React.createElement(
                        side.komponent,
                        { behandlingId: behandlingSuksess.data.id },
                        null
                    )}
                />
            ))}
            <Route path="*" element={<Navigate to="tidligere-vedtaksperioder" />} />
        </Routes>
    );
};

export default BehandlingRoutes;
