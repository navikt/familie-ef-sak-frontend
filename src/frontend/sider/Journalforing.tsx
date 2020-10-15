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
import { useJournalføringState } from '../hooks/useJournalføringState';

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
    const oppgaveIdParam = useGetQueryParams(OPPGAVEID_QUERY_STRING);
    const journalpostId = useGetQueryParams(JOURNALPOST_QUERY_STRING);

    const {
        oppgaveId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
        journalpost,
        valgtDokument,
        forsøktJournalført,
        innsending,
        hentDokument,
        hentJournalPost,
        fullførJournalføring,
    } = useJournalføringState(oppgaveIdParam, journalpostId);

    useEffect(() => {
        if (oppgaveId && journalpostId) {
            hentJournalPost();
        }
    }, [oppgaveId, journalpostId]);

    useEffect(() => {
        if (innsending.status === RessursStatus.SUKSESS) {
            history.push('/oppgavebenk');
        }
    }, [innsending]);

    if (!oppgaveIdParam || !journalpostId) {
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
                                dokumentTitler={dokumentTitler}
                                settDokumentTitler={settDokumentTitler}
                            />
                            <SkjemaGruppe
                                feil={
                                    forsøktJournalført &&
                                    !behandling &&
                                    'Du må velge en behandling for å journalføre'
                                }
                            >
                                <Behandling
                                    settBehandling={settBehandling}
                                    behandling={behandling}
                                    personIdent={data.bruker.id}
                                    behandlingstema={data.behandlingstema}
                                    settFagsakId={settFagsakId}
                                />
                            </SkjemaGruppe>
                            {innsending.status === RessursStatus.FEILET && (
                                <AlertStripeFeil>{innsending.frontendFeilmelding}</AlertStripeFeil>
                            )}
                            <FlexKnapper>
                                <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                                <Hovedknapp
                                    onClick={fullførJournalføring}
                                    spinner={innsending.status === RessursStatus.HENTER}
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
