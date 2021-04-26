import Modal from 'nav-frontend-modal';
import * as React from 'react';

import { AppProvider } from '../context/AppContext';
import { hentInnloggetBruker } from '../api/saksbehandler';
import { ISaksbehandler } from '../typer/saksbehandler';
import ErrorBoundary from './Felleskomponenter/ErrorBoundary/ErrorBoundary';
import Routes from './Routes';
import { TogglesProvider } from '../context/TogglesContext';
import { Provider } from 'react-redux';
import { store } from '../store/store';

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
        <Provider store={store}>
            <ErrorBoundary innloggetSaksbehandler={innloggetSaksbehandler}>
                <AppProvider autentisertSaksbehandler={innloggetSaksbehandler}>
                    <TogglesProvider>
                        <Routes innloggetSaksbehandler={innloggetSaksbehandler} />
                    </TogglesProvider>
                </AppProvider>
            </ErrorBoundary>
        </Provider>
    );
};

export default App;
