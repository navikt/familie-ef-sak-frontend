import Modal from 'nav-frontend-modal';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './App/context/AppContext';
import { hentInnloggetBruker } from './App/api/saksbehandler';
import { ISaksbehandler } from './App/typer/saksbehandler';
import ErrorBoundary from './Felles/ErrorBoundary/ErrorBoundary';
import { TogglesProvider } from './App/context/TogglesContext';
import { BrowserRouter, Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import { HeaderMedSøk } from './Felles/HeaderMedSøk/HeaderMedSøk';
import BehandlingContainer from './Komponenter/Behandling/BehandlingContainer';
import { OppgavebenkApp } from './Komponenter/Oppgavebenk/OppgavebenkApp';
import { JournalforingApp } from './Komponenter/Journalforing/JournalforingApp';
import Personoversikt from './Komponenter/Personoversikt/Personoversikt';
import UgyldigSesjon from './Felles/Modal/SesjonUtløpt';
import UlagretDataModal from './Komponenter/Behandling/Fanemeny/UlagretDataModal';
import EksternRedirectContainer from './Komponenter/EksternRedirect/EksternRedirectContainer';
import UttrekkArbeidssøker from './Komponenter/Uttrekk/UttrekkArbeidssøker';
import { AppEnv, hentEnv } from './App/api/env';
import { Toast } from './Felles/Toast/Toast';
import FagsakTilFagsakPersonRedirect from './Komponenter/Redirect/FagsakTilFagsakPersonRedirect';
import OppgaveMigreringApp from './Komponenter/Migrering/OppgaveMigrering';

Modal.setAppElement(document.getElementById('modal-a11y-wrapper'));

const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<ISaksbehandler>();
    const [appEnv, settAppEnv] = useState<AppEnv>();

    React.useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler: ISaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    React.useEffect(() => {
        hentEnv().then((env: AppEnv) => {
            settAppEnv(env);
        });
    }, []);

    if (!innloggetSaksbehandler || !appEnv) {
        return null;
    }
    return (
        <ErrorBoundary innloggetSaksbehandler={innloggetSaksbehandler}>
            <AppProvider autentisertSaksbehandler={innloggetSaksbehandler} appEnv={appEnv}>
                <TogglesProvider>
                    <AppRoutes innloggetSaksbehandler={innloggetSaksbehandler} />
                </TogglesProvider>
            </AppProvider>
        </ErrorBoundary>
    );
};

export default App;

const AppRoutes: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const { autentisert } = useApp();

    return (
        <BrowserRouter>
            {autentisert ? (
                <AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />
            ) : (
                <UgyldigSesjon />
            )}
        </BrowserRouter>
    );
};

const AppInnhold: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const navigate = useNavigate();
    const { valgtSide, byttUrl, settByttUrl } = useApp();

    useEffect(() => {
        if (valgtSide && byttUrl) {
            settByttUrl(false);
            navigate(valgtSide);
        }
        //eslint-disable-next-line
    }, [byttUrl, valgtSide]);

    return (
        <>
            <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
            <Routes>
                <Route
                    path="/ekstern/fagsak/:eksternFagsakId/:behandlingIdEllerSaksoversikt"
                    element={<EksternRedirectContainer />}
                />
                <Route path="/behandling/:behandlingId/*" element={<BehandlingContainer />} />
                <Route path="/oppgavebenk" element={<OppgavebenkApp />} />
                <Route path="/journalfor" element={<JournalforingApp />} />
                <Route path="/oppgavemigrering" element={<OppgaveMigreringApp />} />
                <Route path="/fagsak/:fagsakId" element={<FagsakTilFagsakPersonRedirect />} />
                <Route path="/person/:fagsakPersonId/*" element={<Personoversikt />} />
                <Route path="/uttrekk/arbeidssoker" element={<UttrekkArbeidssøker />} />
                <Route path="/" element={<Navigate to="/oppgavebenk" replace={true} />} />
            </Routes>
            <UlagretDataModal />
            <Toast />
        </>
    );
};
