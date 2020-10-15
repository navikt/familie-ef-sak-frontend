import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import { IJournalpost } from '../typer/journalforing';
import { RessursStatus } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import Behandling from '../komponenter/Journalforing/Behandling';
import Brukerinfo from '../komponenter/Journalforing/Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from '../komponenter/Journalforing/Dokumentvisning';
import { behandlingstemaTilTekst } from '../typer/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import { useGetQueryParams } from '../hooks/felles/useGetQueryParams';
import DataViewer from '../komponenter/Felleskomponenter/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { JournalføringStateRequest, useJournalføringState } from '../hooks/useJournalføringState';
import { useHentJournalpost } from '../hooks/useHentJournalpost';
import { useHentDokument } from '../hooks/useHentDokument';

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

const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

export const Journalforing: React.FC = () => {
    const history = useHistory();
    const query = useGetQueryParams();
    const oppgaveIdParam = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostIdParam = query.get(JOURNALPOST_QUERY_STRING);

    const journalpostState: JournalføringStateRequest = useJournalføringState();
    const { hentJournalPost, journalpost } = useHentJournalpost(journalpostIdParam);
    const { hentDokument, valgtDokument } = useHentDokument(journalpostIdParam);

    useEffect(() => {
        if (oppgaveIdParam && journalpostIdParam) {
            hentJournalPost();
        }
    }, [oppgaveIdParam, journalpostIdParam]);

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
            history.push('/oppgavebenk');
        }
    }, [journalpostState.innsending]);

    if (!oppgaveIdParam || !journalpostIdParam) {
        return <Redirect to="/oppgavebenk" />;
    }
    return (
        <DataViewer response={journalpost}>
            {(data: IJournalpost) => (
                <SideLayout>
                    <Sidetittel>{`Registrere journalpost: ${
                        data.behandlingstema ? behandlingstemaTilTekst[data.behandlingstema] : ''
                    }`}</Sidetittel>
                    <Kolonner>
                        <div>
                            <Brukerinfo bruker={data.bruker} />
                            <DokumentVisning
                                journalPost={data}
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
                                    personIdent={data.bruker.id}
                                    behandlingstema={data.behandlingstema}
                                    settFagsakId={journalpostState.settFagsakId}
                                />
                            </SkjemaGruppe>
                            {journalpostState.innsending.status === RessursStatus.FEILET && (
                                <AlertStripeFeil>
                                    {journalpostState.innsending.frontendFeilmelding}
                                </AlertStripeFeil>
                            )}
                            <FlexKnapper>
                                <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                                <Hovedknapp
                                    onClick={() =>
                                        journalpostState.fullførJournalføring(journalpostIdParam!)
                                    }
                                    spinner={
                                        journalpostState.innsending.status === RessursStatus.HENTER
                                    }
                                >
                                    Journalfør
                                </Hovedknapp>
                            </FlexKnapper>
                        </div>
                        <div>
                            <PdfVisning pdfFilInnhold={valgtDokument} />
                        </div>
                    </Kolonner>
                </SideLayout>
            )}
        </DataViewer>
    );
};
