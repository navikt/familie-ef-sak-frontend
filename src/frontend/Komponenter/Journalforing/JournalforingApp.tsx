import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import { RessursStatus } from '../../App/typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import Behandling from './Behandling';
import Brukerinfo from './Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from './Dokumentvisning';
import {
    behandlingstemaTilStønadstype,
    behandlingstemaTilTekst,
} from '../../App/typer/behandlingstema';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../App/hooks/useJournalføringState';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import { useHentDokument } from '../../App/hooks/useHentDokument';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { useApp } from '../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../Oppgavebenk/oppgavefilterStorage';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

const SideLayout = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: 2rem;
`;

const Kolonner = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const Venstrekolonne = styled.div``;
const Høyrekolonne = styled.div``;
const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

export const JournalforingApp: React.FC = () => {
    const { toggles } = useToggles();
    const { innloggetSaksbehandler } = useApp();
    const history = useHistory();
    const query: URLSearchParams = useQueryParams();
    const oppgaveIdParam = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostIdParam = query.get(JOURNALPOST_QUERY_STRING);

    const journalpostState: JournalføringStateRequest = useJournalføringState();
    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostIdParam);
    const {
        hentDokument,
        valgtDokument,
        hentFørsteDokument,
        hentNesteDokument,
        hentForrigeDokument,
    } = useHentDokument(journalpostIdParam);
    const { hentFagsak, fagsak } = useHentFagsak();

    useEffect(() => {
        if (oppgaveIdParam && journalpostIdParam) {
            hentJournalPost();
            journalpostState.settOppgaveId(oppgaveIdParam);
        }
        // eslint-disable-next-line
    }, [oppgaveIdParam, journalpostIdParam]);

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
            const lagredeOppgaveFiltreringer = hentFraLocalStorage(oppgaveRequestKey, {});

            lagreTilLocalStorage(oppgaveRequestKey, {
                ...lagredeOppgaveFiltreringer,
                ident:
                    journalResponse.status === RessursStatus.SUKSESS
                        ? journalResponse.data.personIdent
                        : undefined,
            });
            history.push('/oppgavebenk');
        }
        // eslint-disable-next-line
    }, [journalpostState.innsending]);

    useEffect(() => {
        if (journalResponse.status === RessursStatus.SUKSESS) {
            const stønadstype = behandlingstemaTilStønadstype(
                journalResponse.data.journalpost.behandlingstema
            );
            stønadstype && hentFagsak(journalResponse.data.personIdent, stønadstype);
            hentFørsteDokument(journalResponse.data.journalpost);
        }
        // eslint-disable-next-line
    }, [journalResponse]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            journalpostState.settFagsakId(fagsak.data.id);
        }
        // eslint-disable-next-line
    }, [fagsak]);

    if (!oppgaveIdParam || !journalpostIdParam) {
        return <Redirect to="/oppgavebenk" />;
    }

    return (
        <DataViewer response={{ journalResponse }}>
            {({ journalResponse }) => (
                <SideLayout className={'container'}>
                    <Sidetittel>{`Registrere journalpost: ${
                        journalResponse.journalpost.behandlingstema
                            ? behandlingstemaTilTekst[journalResponse.journalpost.behandlingstema]
                            : ''
                    }`}</Sidetittel>
                    <Kolonner>
                        <Venstrekolonne>
                            <Brukerinfo personIdent={journalResponse.personIdent} />
                            <DokumentVisning
                                journalPost={journalResponse.journalpost}
                                hentDokument={hentDokument}
                                dokumentTitler={journalpostState.dokumentTitler}
                                settDokumentTitler={journalpostState.settDokumentTitler}
                            />
                            <SkjemaGruppe
                                feil={
                                    journalpostState.forsøktJournalført &&
                                    !journalpostState.behandling &&
                                    'Du må velge en behandling for å journalføre'
                                }
                            >
                                <Behandling
                                    settBehandling={journalpostState.settBehandling}
                                    behandling={journalpostState.behandling}
                                    fagsak={fagsak}
                                />
                            </SkjemaGruppe>
                            {journalpostState.innsending.status === RessursStatus.FEILET && (
                                <AlertStripeFeil>
                                    {journalpostState.innsending.frontendFeilmelding}
                                </AlertStripeFeil>
                            )}
                            <FlexKnapper>
                                <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                                {toggles[ToggleName.journalfoer] && (
                                    <Hovedknapp
                                        onClick={() =>
                                            journalpostState.fullførJournalføring(
                                                journalpostIdParam,
                                                innloggetSaksbehandler?.enhet || '9999',
                                                innloggetSaksbehandler?.navIdent
                                            )
                                        }
                                        spinner={
                                            journalpostState.innsending.status ===
                                            RessursStatus.HENTER
                                        }
                                    >
                                        Journalfør
                                    </Hovedknapp>
                                )}
                            </FlexKnapper>
                        </Venstrekolonne>
                        <Høyrekolonne>
                            <FlexKnapper>
                                <Knapp
                                    onClick={() => hentForrigeDokument(journalResponse.journalpost)}
                                    mini
                                >
                                    Forrige Dokument
                                </Knapp>
                                <Knapp
                                    onClick={() => hentNesteDokument(journalResponse.journalpost)}
                                    mini
                                >
                                    Neste Dokument
                                </Knapp>
                            </FlexKnapper>
                            <PdfVisning pdfFilInnhold={valgtDokument} />
                        </Høyrekolonne>
                    </Kolonner>
                </SideLayout>
            )}
        </DataViewer>
    );
};
