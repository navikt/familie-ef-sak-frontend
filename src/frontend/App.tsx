import Modal from 'nav-frontend-modal';
import * as React from 'react';

import { AppProvider, useApp } from './App/context/AppContext';
import { hentInnloggetBruker } from './App/api/saksbehandler';
import { ISaksbehandler } from './App/typer/saksbehandler';
import ErrorBoundary from './Felles/ErrorBoundary/ErrorBoundary';
import { TogglesProvider } from './App/context/TogglesContext';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { HeaderMedSøk } from './Felles/HeaderMedSøk/HeaderMedSøk';
import BehandlingContainer from './Komponenter/Behandling/BehandlingContainer';
import { OppgavebenkApp } from './Komponenter/Oppgavebenk/OppgavebenkApp';
import { JournalforingApp } from './Komponenter/Journalforing/JournalforingApp';
import Personoversikt from './Komponenter/Personoversikt/Personoversikt';
import UgyldigSesjon from './Felles/Modal/SesjonUtløpt';

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

    if (!innloggetSaksbehandler) {
        return null;
    }
    return (
        <ErrorBoundary innloggetSaksbehandler={innloggetSaksbehandler}>
            <AppProvider autentisertSaksbehandler={innloggetSaksbehandler}>
                <TogglesProvider>
                    <Routes innloggetSaksbehandler={innloggetSaksbehandler} />
                </TogglesProvider>
            </AppProvider>
        </ErrorBoundary>
    );
};

export default App;

const Routes: React.FC<{ innloggetSaksbehandler?: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const { autentisert } = useApp();

    return (
        <Router>
            {autentisert ? (
                <>
                    <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
                    <Switch>
                        <Route path="/behandling/:behandlingId" component={BehandlingContainer} />
                        <Route path="/oppgavebenk" component={OppgavebenkApp} />
                        <Route path="/journalfor" component={JournalforingApp} />
                        <Route path="/fagsak/:fagsakId" component={Personoversikt} />
                        <Redirect from="/" to="/oppgavebenk" />
                    </Switch>
                </>
            ) : (
                <UgyldigSesjon />
            )}
        </Router>
    );
};
