import { useCallback, useMemo, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { IJournalpost } from '../typer/journalforing';
import { useApp } from '../context/AppContext';
import { BehandlingType } from '../typer/behandlingtype';
import { AxiosRequestConfig } from 'axios';

export interface BehandlingRequest {
    behandlingsId?: string;
    behandlingType?: BehandlingType;
}

interface JournalføringRequest {
    dokumentTitler?: Record<string, string>;
    fagsakId: string;
    oppgaveId: string;
    behandling?: BehandlingRequest;
}

export const useJournalføringState = (oppgaveIdParam?: string, journalpostIdParam?: string) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [oppgaveId] = useState<string>(oppgaveIdParam || '');
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<Record<string, string>>();
    const [journalpost, settJournalpost] = useState<Ressurs<IJournalpost>>(byggTomRessurs());
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());
    const [forsøktJournalført, settForsøktJournalført] = useState<boolean>(false);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());

    const hentJournalpostConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}`,
        }),
        [journalpostIdParam]
    );

    const hentJournalPost = useCallback(() => {
        settJournalpost({ status: RessursStatus.HENTER });
        axiosRequest<IJournalpost, null>(
            hentJournalpostConfig,
            innloggetSaksbehandler
        ).then((res: Ressurs<IJournalpost>) => settJournalpost(res));
    }, [hentJournalpostConfig]);

    const fullførJournalføring = () => {
        settForsøktJournalført(true);
        if (!behandling || innsending.status === RessursStatus.HENTER) {
            return;
        }
        settInnsending(byggHenterRessurs());

        const data: JournalføringRequest = {
            oppgaveId,
            fagsakId,
            behandling,
            dokumentTitler,
        };
        axiosRequest<string, JournalføringRequest>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}/`,
                data,
            },
            innloggetSaksbehandler
        ).then((response: Ressurs<string>) => {
            settInnsending(response);
        });
    };

    const hentDokument = (dokumentInfoId: string) => {
        axiosRequest<string, null>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}/dokument/${dokumentInfoId}`,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<string>) => settValgtDokument(res));
    };

    return {
        oppgaveId,
        fagsakId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
        journalpost,
        settJournalpost,
        valgtDokument,
        settValgtDokument,
        forsøktJournalført,
        innsending,
        hentDokument,
        hentJournalPost,
        fullførJournalføring,
    };
};
