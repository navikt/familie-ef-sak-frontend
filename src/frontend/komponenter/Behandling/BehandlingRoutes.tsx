import { Redirect, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { sider } from '../Fanemeny/sider';

const BehandlingRoutes: React.FC = () => {
    return (
        <Switch>
            <Redirect
                exact={true}
                from="/behandling/:behandlingId/"
                to="/behandling/:behandlingId/inngangsvilkar"
            />
            {sider.map((side) => (
                <Route id={side.navn} exact={true} path={`/behandling/:behandlingId/${side.href}`}>
                    {(props: RouteComponentProps<{ behandlingId: string }>) =>
                        React.createElement(
                            side.komponent,
                            { behandlingId: props.match.params.behandlingId },
                            null
                        )
                    }
                </Route>
            ))}
        </Switch>
    );
};

export default BehandlingRoutes;
