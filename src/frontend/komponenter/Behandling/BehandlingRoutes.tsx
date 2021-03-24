import { Redirect, Route, Switch } from 'react-router-dom';
import Personopplysninger from './Personopplysninger/Personopplysninger';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import Aktivitet from './Aktivitet/Aktivitet';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Brev from './Brev/Brev';
import VedtakOgBeregning from './VedtakOgBeregning/VedtakOgBeregning';
import Blankett from './Blankett/Blankett';

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
                component={Personopplysninger}
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
                path="/behandling/:behandlingId/aktivitet"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Aktivitet behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/vedtak-og-beregning"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <VedtakOgBeregning behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/brev"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Brev behandlingId={props.match.params.behandlingId} />;
                }}
            />
            <Route
                exact={true}
                path="/behandling/:behandlingId/blankett"
                render={(props: RouteComponentProps<{ behandlingId: string }>) => {
                    return <Blankett behandlingId={props.match.params.behandlingId} />;
                }}
            />
        </Switch>
    );
};

export default BehandlingRoutes;
