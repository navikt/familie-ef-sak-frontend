import { HeaderMedSøk } from './HeaderMedSøk/HeaderMedSøk';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import { ISaksbehandler } from '../typer/saksbehandler';
import { useApp } from '../context/AppContext';
import UgyldigSesjon from './Felleskomponenter/Modal/SesjonUtløpt';
import BehandlingContainer from './Behandling/BehandlingContainer';
import { OppgaveBenk } from '../sider/Oppgavebenk';
import { Journalforing } from '../sider/Journalforing';
import Fagsakoversikt from '../sider/Fagsakoversikt';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const Routes: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const { autentisert } = useApp();

    return (
        <Router>
            {autentisert ? (
                <>
                    <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
                    <div className={'container'} role="main">
                        <Switch>
                            <Route
                                path="/behandling/:behandlingId"
                                component={BehandlingContainer}
                            />
                            <Route path="/oppgavebenk" component={OppgaveBenk} />
                            <Route path="/journalfor" component={Journalforing} />
                            <Route path="/fagsak/:fagsakId" component={Fagsakoversikt} />
                            <Redirect from="/" to="/oppgavebenk" />
                        </Switch>
                    </div>
                </>
            ) : (
                <UgyldigSesjon />
            )}
        </Router>
    );
};

export default Routes;
