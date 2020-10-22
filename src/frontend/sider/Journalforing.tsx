import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import { IJojurnalpostResponse, IJournalpost } from '../typer/journalforing';
import { RessursStatus } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import Behandling from '../komponenter/Journalforing/Behandling';
import Brukerinfo from '../komponenter/Journalforing/Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from '../komponenter/Journalforing/Dokumentvisning';
import { behandlingstemaTilStønadstype, behandlingstemaTilTekst } from '../typer/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import { useGetQueryParams } from '../hooks/felles/useGetQueryParams';
import DataViewer from '../komponenter/Felleskomponenter/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { JournalføringStateRequest, useJournalføringState } from '../hooks/useJournalføringState';
import { useHentJournalpost } from '../hooks/useHentJournalpost';
import { useHentDokument } from '../hooks/useHentDokument';
import { useHentFagsak } from '../hooks/useHentFagsak';

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

export const Journalforing: React.FC = () => {
    const history = useHistory();
    const query = useGetQueryParams();
    const oppgaveIdParam = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostIdParam = query.get(JOURNALPOST_QUERY_STRING);

    const journalpostState: JournalføringStateRequest = useJournalføringState();
    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostIdParam);
    const { hentDokument, valgtDokument } = useHentDokument(journalpostIdParam);
    const { hentFagsak, fagsak } = useHentFagsak();

    useEffect(() => {
        if (oppgaveIdParam && journalpostIdParam) {
            hentJournalPost();
            journalpostState.settOppgaveId(oppgaveIdParam);
        }
    }, [oppgaveIdParam, journalpostIdParam]);

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
            history.push('/oppgavebenk');
        }
    }, [journalpostState.innsending]);

    useEffect(() => {
        if (journalResponse.status === RessursStatus.SUKSESS) {
            const stønadstype = behandlingstemaTilStønadstype(
                journalResponse.data.journalpost.behandlingstema
            );
            stønadstype && hentFagsak(journalResponse.data.personIdent, stønadstype);
        }
    }, [journalResponse]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            journalpostState.settFagsakId(fagsak.data.id);
        }
    }, [fagsak]);

    if (!oppgaveIdParam || !journalpostIdParam) {
        return <Redirect to="/oppgavebenk" />;
    }
    return (
        <DataViewer response={journalResponse}>
            {(data: IJojurnalpostResponse) => (
                <SideLayout>
                    <Sidetittel>{`Registrere journalpost: ${
                        data.journalpost.behandlingstema
                            ? behandlingstemaTilTekst[data.journalpost.behandlingstema]
                            : ''
                    }`}</Sidetittel>
                    <Kolonner>
                        <Venstrekolonne>
                            <Brukerinfo personIdent={data.personIdent} />
                            <DokumentVisning
                                journalPost={data.journalpost}
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
                        </Venstrekolonne>
                        <Høyrekolonne>
                            <PdfVisning pdfFilInnhold={valgtDokument} />
                        </Høyrekolonne>
                    </Kolonner>
                </SideLayout>
            )}
        </DataViewer>
    );
};
