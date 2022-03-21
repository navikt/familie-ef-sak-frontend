import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { filtrerSiderEtterBehandlingstype } from './Fanemeny/sider';
import { useBehandling } from '../../App/context/BehandlingContext';
import { RessursSuksess } from '../../App/typer/ressurs';
import { Behandling } from '../../App/typer/fagsak';

const BehandlingRoutes: React.FC = () => {
    const { behandling } = useBehandling();
    const behandlingSuksess = behandling as RessursSuksess<Behandling>;

    const siderForBehandling = filtrerSiderEtterBehandlingstype(behandlingSuksess.data);
    return (
        <Routes>
            {siderForBehandling.map((side) => (
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
            <Route path="*" element={<Navigate to={siderForBehandling[0].href} replace={true} />} />
        </Routes>
    );
};

export default BehandlingRoutes;
