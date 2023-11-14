import { BodyLong } from '@navikt/ds-react';
import * as React from 'react';
import { useState } from 'react';
import { AppProvider, useApp } from './App/context/AppContext';
import { hentInnloggetBruker } from './App/api/saksbehandler';
import { ISaksbehandler } from './App/typer/saksbehandler';
import ErrorBoundary from './Felles/ErrorBoundary/ErrorBoundary';
import { TogglesProvider } from './App/context/TogglesContext';
import { HeaderMedSøk } from './Felles/HeaderMedSøk/HeaderMedSøk';
import { BehandlingContainer } from './Komponenter/Behandling/BehandlingContainer';
import { OppgavebenkApp } from './Komponenter/Oppgavebenk/OppgavebenkApp';
import Personoversikt from './Komponenter/Personoversikt/Personoversikt';
import EksternRedirectContainer from './Komponenter/EksternRedirect/EksternRedirectContainer';
import UttrekkArbeidssøker from './Komponenter/Uttrekk/UttrekkArbeidssøker';
import { AppEnv, hentEnv } from './App/api/env';
import { Toast } from './Felles/Toast/Toast';
import FagsakTilFagsakPersonRedirect from './Komponenter/Redirect/FagsakTilFagsakPersonRedirect';
import { AdminApp } from './Komponenter/Admin/AdminApp';
import ScrollToTop from './Felles/ScrollToTop/ScrollToTop';
import styled from 'styled-components';
import { ModalWrapper } from './Felles/Modal/ModalWrapper';
import VelgPersonOgStønadstype from './Komponenter/Behandling/Førstegangsbehandling/VelgPersonOgStønadstype';
import OpprettFørstegangsbehandling from './Komponenter/Behandling/Førstegangsbehandling/OpprettFørstegangsbehandling';
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Outlet,
    Navigate,
    Route,
    useLocation,
} from 'react-router-dom';
import UlagretDataModal from './Felles/Visningskomponenter/UlagretDataModal';
import { loggBesøkEvent } from './App/utils/amplitude/amplitudeLoggEvents';
import { BesøkEvent } from './App/utils/amplitude/typer';
import Innloggingsfeilmelding from './Felles/Varsel/Innloggingsfeilmelding';
import { JournalføringApp } from './Komponenter/Journalføring/Standard/JournalføringApp';

const Innhold = styled(BodyLong)`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

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

    const router = createBrowserRouter(
        createRoutesFromElements(
            autentisert ? (
                <Route
                    path={'/'}
                    element={<AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />}
                >
                    <Route
                        path="/ekstern/fagsak/:eksternFagsakId/:behandlingIdEllerSaksoversikt"
                        element={<EksternRedirectContainer />}
                    />
                    <Route path="/behandling/:behandlingId/*" element={<BehandlingContainer />} />
                    <Route path="/oppgavebenk" element={<OppgavebenkApp />} />
                    <Route path="/journalfor" element={<JournalføringApp />} />
                    <Route path="/admin/*" element={<AdminApp />} />
                    <Route path="/fagsak/:fagsakId" element={<FagsakTilFagsakPersonRedirect />} />
                    <Route path="/person/:fagsakPersonId/*" element={<Personoversikt />} />
                    <Route path="/uttrekk/arbeidssoker" element={<UttrekkArbeidssøker />} />
                    <Route
                        path={`/opprett-forstegangsbehandling`}
                        element={<VelgPersonOgStønadstype />}
                    />
                    <Route
                        path={`/opprett-forstegangsbehandling/:fagsakId`}
                        element={<OpprettFørstegangsbehandling />}
                    />
                    <Route path="/" element={<Navigate to="/oppgavebenk" replace={true} />} />
                </Route>
            ) : (
                <Route
                    path={'*'}
                    element={
                        <ModalWrapper
                            tittel={'Ugyldig sesjon'}
                            visModal={true}
                            ariaLabel={'Sesjonen har utløpt. Prøv å last inn siden på nytt.'}
                        >
                            <Innhold>Prøv å last siden på nytt</Innhold>
                        </ModalWrapper>
                    }
                />
            )
        )
    );
    return <RouterProvider router={router} />;
};

const AppInnhold: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const location = useLocation();

    const utledBesøktSide = (path: string): BesøkEvent => {
        const paths = path.split('/');
        const side = paths[1];

        if (side === 'person' || side === 'behandling') {
            return { side: side, fane: paths.slice(3).join('/') };
        }

        return { side: path };
    };

    React.useEffect(() => {
        loggBesøkEvent(utledBesøktSide(location.pathname));
    }, [location]);

    return (
        <>
            <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
            <Innloggingsfeilmelding innloggetSaksbehandler={innloggetSaksbehandler} />
            <ScrollToTop />
            <Outlet />
            <Toast />
            <UlagretDataModal />
        </>
    );
};
