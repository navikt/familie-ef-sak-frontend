import React, { useCallback, useEffect } from 'react';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { RessursStatus } from '../../App/typer/ressurs';
import { behandlingstemaTilStønadstype } from '../../App/typer/behandlingstema';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Navigate, useNavigate } from 'react-router-dom';
import { IJojurnalpostResponse } from '../../App/typer/journalforing';
import Infotrygdperioderoversikt from '../Personoversikt/Infotrygdperioderoversikt';

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

const OppgaveMigrering: React.FC<{ oppgaveId: string; journalpostId: string }> = ({
    oppgaveId,
    journalpostId,
}) => {
    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostId);
    const { hentFagsak, fagsak } = useHentFagsak();

    const navigate = useNavigate();

    const triggerHentFagsak = useCallback(
        (journalpost: IJojurnalpostResponse) => {
            const stønadstype = behandlingstemaTilStønadstype(
                journalpost.journalpost.behandlingstema
            );
            stønadstype && hentFagsak(journalpost.personIdent, stønadstype);
        },
        [hentFagsak]
    );

    useEffect(() => {
        if (journalpostId) {
            hentJournalPost();
        }
    }, [hentJournalPost, journalpostId]);

    useEffect(() => {
        if (journalResponse.status === RessursStatus.SUKSESS) {
            triggerHentFagsak(journalResponse.data);
        }
    }, [triggerHentFagsak, journalResponse]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS && fagsak.data.erMigrert) {
            navigate(`/journalfor?journalpostId=${journalpostId}&oppgaveId=${oppgaveId}`);
        }
    }, [fagsak, navigate, oppgaveId, journalpostId]);

    return (
        <DataViewer response={{ fagsak, journalResponse }}>
            {({ fagsak, journalResponse }) => {
                if (!fagsak.erMigrert) {
                    return (
                        <Infotrygdperioderoversikt
                            fagsakId={fagsak.id}
                            personIdent={journalResponse.personIdent}
                            onMigrert={() => {
                                triggerHentFagsak(journalResponse);
                            }}
                        />
                    );
                } else {
                    return <div>Sender til journalføring</div>;
                }
            }}
        </DataViewer>
    );
};

const OppgaveMigreringApp: React.FC = () => {
    const query: URLSearchParams = useQueryParams();
    const oppgaveIdParam = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostIdParam = query.get(JOURNALPOST_QUERY_STRING);

    if (!journalpostIdParam || !oppgaveIdParam) {
        return <Navigate to="/oppgavebenk" />;
    }

    return <OppgaveMigrering oppgaveId={oppgaveIdParam} journalpostId={journalpostIdParam} />;
};

export default OppgaveMigreringApp;
