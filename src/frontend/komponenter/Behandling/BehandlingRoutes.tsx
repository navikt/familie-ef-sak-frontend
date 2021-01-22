import { Redirect, Route, Switch } from 'react-router-dom';
import Personopplysninger from './Personopplysninger/Personopplysninger';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Brev from './Brev/Brev';
import Utbetalingsoversikt from './Utbetalingsoversikt/Utbetalingsoversikt';
import Inntekt from './Inntekt/Inntekt';

const BehandlingRoutes: React.FC = () => {
    return (
        <Switch>
            <Redirect
                exact={true}
                from="/behandling/:behandlingId/"
                to="/behandling/:behandlingId/inngangsvilkar"
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/personopplysninger"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Personopplysninger behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/inngangsvilkar"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Inngangsvilkår behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/inntekt"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Inntekt behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/utbetalingsoversikt"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Utbetalingsoversikt behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route exact={true} path="/behandling/:behandlingId/brev" component={Brev} />
        </Switch>
    );
};

export default BehandlingRoutes;
