import { Redirect, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import { filtrerSiderEtterBehandlingstype, sider } from '../Fanemeny/sider';
import { useBehandling } from '../../context/BehandlingContext';
import { RessursSuksess } from '../../typer/ressurs';
import { Behandling } from '../../typer/fagsak';

const BehandlingRoutes: React.FC = () => {
    const { behandling } = useBehandling();
    const behandlingSuksess = behandling as RessursSuksess<Behandling>;
    return (
        <Switch>
            <Redirect
                exact={true}
                from="/behandling/:behandlingId/"
                to="/behandling/:behandlingId/inngangsvilkar"
            />
            {filtrerSiderEtterBehandlingstype(sider, behandlingSuksess.data).map((side) => (
                <Route key={side.navn} exact={true} path={`/behandling/:behandlingId/${side.href}`}>
                    {React.createElement(
                        side.komponent,
                        { behandlingId: behandlingSuksess.data.id },
                        null
                    )}
                </Route>
            ))}
        </Switch>
    );
};

export default BehandlingRoutes;
