import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { filtrerSiderEtterBehandlingstype } from './Fanemeny/sider';
import { Behandling } from '../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    const siderForBehandling = filtrerSiderEtterBehandlingstype(behandling);
    return (
        <Routes>
            {siderForBehandling.map((side) => (
                <Route
                    key={side.navn}
                    path={`${side.href}`}
                    element={React.createElement(side.komponent, { behandling: behandling }, null)}
                />
            ))}
            <Route path="*" element={<Navigate to={siderForBehandling[0].href} replace={true} />} />
        </Routes>
    );
};

export default BehandlingRoutes;
