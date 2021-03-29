import Modal from 'nav-frontend-modal';
import * as React from 'react';

import { AppProvider } from '../context/AppContext';
import { hentInnloggetBruker } from '../api/saksbehandler';
import { ISaksbehandler } from '../typer/saksbehandler';
import ErrorBoundary from './Felleskomponenter/ErrorBoundary/ErrorBoundary';
import Container from './Container';

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
                <Container innloggetSaksbehandler={innloggetSaksbehandler} />
            </AppProvider>
        </ErrorBoundary>
    );
};

export default App;
