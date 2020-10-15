import { Dispatch, SetStateAction, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { BehandlingType } from '../typer/behandlingtype';

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

export interface JournalføringStateRequest {
    oppgaveId: string;
    settOppgaveId: Dispatch<SetStateAction<string>>;
    fagsakId: string;
    settFagsakId: Dispatch<SetStateAction<string>>;
    behandling?: BehandlingRequest;
    settBehandling: Dispatch<SetStateAction<BehandlingRequest | undefined>>;
    dokumentTitler?: Record<string, string>;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
    forsøktJournalført: boolean;
    settForsøktJournalført: Dispatch<SetStateAction<boolean>>;
    innsending: Ressurs<string>;
    settInnsending: Dispatch<SetStateAction<Ressurs<string>>>;
    fullførJournalføring: (journalpostId: string) => void;
}

export const useJournalføringState = (): JournalføringStateRequest => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [oppgaveId, settOppgaveId] = useState<string>('');
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<Record<string, string>>();
    const [forsøktJournalført, settForsøktJournalført] = useState<boolean>(false);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());

    const fullførJournalføring = (journalpostId: string) => {
        settForsøktJournalført(true);
        if (!behandling || innsending.status === RessursStatus.HENTER) {
            return;
        }

        const data: JournalføringRequest = {
            oppgaveId,
            fagsakId,
            behandling,
            dokumentTitler,
        };
        settInnsending(byggHenterRessurs());
        axiosRequest<string, JournalføringRequest>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}/`,
                data,
            },
            innloggetSaksbehandler
        ).then((resp) => settInnsending(resp));
    };

    return {
        oppgaveId,
        settOppgaveId,
        fagsakId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
        forsøktJournalført,
        settForsøktJournalført,
        innsending,
        settInnsending,
        fullførJournalføring,
    };
};
