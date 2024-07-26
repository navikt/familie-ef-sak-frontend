import { BodyLong } from '@navikt/ds-react';
import * as React from 'react';
import { useState } from 'react';
import { AppProvider, useApp } from './App/context/AppContext';
import { hentInnloggetBruker } from './App/api/saksbehandler';
import { ISaksbehandler } from './App/typer/saksbehandler';
import ErrorBoundary from './Felles/ErrorBoundary/ErrorBoundary';
import { TogglesProvider } from './App/context/TogglesContext';
import { HeaderMedSøk } from './Felles/HeaderMedSøk/HeaderMedSøk';
import { BehandlingSide } from './Komponenter/Behandling/BehandlingSide';
import { OppgavebenkSide } from './Komponenter/Oppgavebenk/OppgavebenkSide';
import { AppEnv, hentEnv } from './App/api/env';
import { Toast } from './Felles/Toast/Toast';
import { AdminSide } from './Komponenter/Admin/AdminSide';
import ScrollToTop from './Felles/ScrollToTop/ScrollToTop';
import { ModalWrapper } from './Felles/Modal/ModalWrapper';
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
import { JournalføringSide } from './Komponenter/Journalføring/Standard/JournalføringSide';
import { EksternIdRedirect } from './Komponenter/Redirect/EksternIdRedirect';
import { FagsakTilFagsakPersonRedirect } from './Komponenter/Redirect/FagsakTilFagsakPersonRedirect';
import { PersonOversiktSide } from './Komponenter/Personoversikt/PersonOversiktSide';
import { UttrekkArbeidssøkerSide } from './Komponenter/Uttrekk/UttrekkArbeidssøkerSide';
import { VelgPersonOgStønadstypeSide } from './Komponenter/Behandling/Førstegangsbehandling/VelgPersonOgStønadstypeSide';
import { OpprettFørstegangsbehandlingSide } from './Komponenter/Behandling/Førstegangsbehandling/OpprettFørstegangsbehandlingSide';

export const App: React.FC = () => {
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
                        element={<EksternIdRedirect />}
                    />
                    <Route path="/behandling/:behandlingId/*" element={<BehandlingSide />} />
                    <Route path="/oppgavebenk" element={<OppgavebenkSide />} />
                    <Route path="/journalfor" element={<JournalføringSide />} />
                    <Route path="/admin/*" element={<AdminSide />} />
                    <Route path="/fagsak/:fagsakId" element={<FagsakTilFagsakPersonRedirect />} />
                    <Route path="/person/:fagsakPersonId/*" element={<PersonOversiktSide />} />
                    <Route path="/uttrekk/arbeidssoker" element={<UttrekkArbeidssøkerSide />} />
                    <Route
                        path={`/opprett-forstegangsbehandling`}
                        element={<VelgPersonOgStønadstypeSide />}
                    />
                    <Route
                        path={`/opprett-forstegangsbehandling/:fagsakId`}
                        element={<OpprettFørstegangsbehandlingSide />}
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
                            <BodyLong>Prøv å last siden på nytt</BodyLong>
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
