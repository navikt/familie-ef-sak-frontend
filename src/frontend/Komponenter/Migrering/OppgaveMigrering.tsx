import React, { useCallback, useEffect, useState } from 'react';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { RessursStatus } from '../../App/typer/ressurs';
import { behandlingstemaTilStønadstype } from '../../App/typer/behandlingstema';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Navigate, useNavigate } from 'react-router-dom';
import { IJojurnalpostResponse } from '../../App/typer/journalforing';
import Infotrygdperioderoversikt from '../Personoversikt/Infotrygdperioderoversikt';
import { useHentBehandling } from '../../App/hooks/useHentBehandling';
import { Behandlingsårsak } from '../../App/typer/Behandlingsårsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

const VentPåBehandlingFerdigstilt: React.FC<{
    oppgaveId: string;
    journalpostId: string;
    behandlingId: string;
}> = ({ oppgaveId, journalpostId, behandlingId }) => {
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const [timeLeft, settTimeLeft] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (behandlingId !== '' && timeLeft === 0) {
            hentBehandlingCallback();
        }
    }, [hentBehandlingCallback, behandlingId, timeLeft]);

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS)
            if (behandling.data.status !== BehandlingStatus.FERDIGSTILT) {
                settTimeLeft(10);
            }
    }, [hentBehandlingCallback, behandling]);

    useEffect(() => {
        const timer = setInterval(() => {
            settTimeLeft((prevState) => (prevState > 0 ? prevState - 1 : prevState));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (behandling.status === RessursStatus.SUKSESS) {
        if (behandling.data.status === BehandlingStatus.FERDIGSTILT) {
            navigate(`/journalfor?journalpostId=${journalpostId}&oppgaveId=${oppgaveId}`);
        }
        return (
            <>
                <div>
                    Status på behandling: {behandling.data.status}, henter status på nytt om{' '}
                    {timeLeft}s
                </div>
                <div>For å kunne journalføre så må behandlingen være ferdigstilt.</div>
            </>
        );
    }
    return <div>Henter status på behandling</div>;
};

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
            //navigate(`/journalfor?journalpostId=${journalpostId}&oppgaveId=${oppgaveId}`);
        }
    }, [fagsak, navigate, oppgaveId, journalpostId]);

    return (
        <DataViewer response={{ fagsak, journalResponse }}>
            {({ fagsak, journalResponse }) => {
                const behandling = fagsak.behandlinger.find(
                    (b) => b.behandlingsårsak === Behandlingsårsak.MIGRERING
                ); // TODO burde denne bare sjekke på siste behandlingen kanskje? Hvis eks man allerede har en revurdering på en behandling der det finnes en journalføringsoppgve med "JOURNALFØRES I GOSYS"
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
                } else if (behandling != null) {
                    return (
                        <VentPåBehandlingFerdigstilt
                            journalpostId={journalpostId}
                            oppgaveId={oppgaveId}
                            behandlingId={behandling.id}
                        />
                    );
                } else {
                    return <div>Finner ikke behandling som er satt til migrering</div>;
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
