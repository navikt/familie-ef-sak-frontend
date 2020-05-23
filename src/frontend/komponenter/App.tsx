import Modal from 'nav-frontend-modal';
import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { hentInnloggetBruker } from '../api/saksbehandler';
import { ISaksbehandler } from '../typer/saksbehandler';
import PersonInfo from './Person/PersonInfo';
import { HeaderMedSøk } from './HeaderMedSøk/HeaderMedSøk';
import ErrorBoundary from './Felleskomponenter/ErrorBoundary/ErrorBoundary';

Modal.setAppElement(document.getElementById('modal-a11y-wrapper'));

const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = React.useState<
        ISaksbehandler | undefined
    >(undefined);

    React.useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler: ISaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    return (
        <ErrorBoundary innloggetSaksbehandler={innloggetSaksbehandler}>
            <div>
                <Router>
                    <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
                    <div className={'container'} role="main">
                        <Switch>
                            <Route
                                exact={true}
                                path={'/'}
                                render={() => {
                                    return <Redirect from="/" to="/soker/finn" />;
                                }}
                            />
                            <Route
                                exact={true}
                                path="/soker/finn"
                                render={() => {
                                    return <PersonInfo />;
                                }}
                            />
                        </Switch>
                    </div>
                </Router>
            </div>
        </ErrorBoundary>
    );
};

export default App;
