import { HeaderMedSøk } from './HeaderMedSøk/HeaderMedSøk';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import { ISaksbehandler } from '../typer/saksbehandler';
import { useApp } from '../context/AppContext';
import UgyldigSesjon from './Felleskomponenter/Modal/SesjonUtløpt';
import { SakProvider } from '../context/SakContext';
import SakContainer from './Sak/SakContainer';
import SakListeContainer from './Sak/SakListeContainer';
import BehandlingContainer from './Behandling/BehandlingContainer';
import { OppgaveBenk } from '../sider/Oppgavebenk';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const Container: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const { autentisert } = useApp();

    return (
        <Router>
            {autentisert ? (
                <>
                    <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
                    <div className={'container'} role="main">
                        <SakProvider>
                            <Switch>
                                <Redirect exact={true} from="/" to="/sak" />
                                <Route
                                    path="/behandling/:behandlingId"
                                    component={BehandlingContainer}
                                />
                                <Route path="/sak/:sakId" component={SakContainer} />
                                <Route path="/sak" component={SakListeContainer} />
                                <Route path="/oppgavebenk" component={OppgaveBenk} />
                                <Redirect to="/sak" />
                            </Switch>
                        </SakProvider>
                    </div>
                </>
            ) : (
                <UgyldigSesjon />
            )}
        </Router>
    );
};

export default Container;
