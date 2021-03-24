import { HeaderMedSøk } from './HeaderMedSøk/HeaderMedSøk';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import { useEffect } from 'react';
import { ISaksbehandler } from '../typer/saksbehandler';
import { useApp } from '../context/AppContext';
import UgyldigSesjon from './Felleskomponenter/Modal/SesjonUtløpt';
import BehandlingContainer from './Behandling/BehandlingContainer';
import { OppgaveBenk } from '../sider/Oppgavebenk';
import { Journalforing } from '../sider/Journalforing';
import Fagsakoversikt from '../sider/Fagsakoversikt';
import hentToggles from '../toggles/api';
import { useToggles } from '../context/TogglesContext';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const Container: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const { autentisert } = useApp();
    const { settToggles } = useToggles();

    useEffect(() => {
        Promise.all([fetchToggles()]);
    }, [innloggetSaksbehandler]);

    const fetchToggles = () => {
        return hentToggles(settToggles).catch((err: Error) => {
            console.log('Kunne ikke hente toggles, ' + err.message);
        });
    };

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

export default Container;
