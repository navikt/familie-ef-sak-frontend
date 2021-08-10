import { Dispatch, SetStateAction, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandlingstype } from '../typer/behandlingstype';

export interface BehandlingRequest {
    behandlingsId?: string;
    behandlingstype?: Behandlingstype;
}

interface JournalføringRequest {
    dokumentTitler?: Record<string, string>;
    fagsakId: string;
    oppgaveId: string;
    behandling?: BehandlingRequest;
    journalførendeEnhet: string;
    navIdent?: string;
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
    fullførJournalføring: (
        journalpostId: string,
        journalførendeEnhet: string,
        navIdent?: string
    ) => void;
}

export const useJournalføringState = (): JournalføringStateRequest => {
    const { axiosRequest } = useApp();
    const [oppgaveId, settOppgaveId] = useState<string>('');
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<Record<string, string>>();
    const [forsøktJournalført, settForsøktJournalført] = useState<boolean>(false);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());

    const fullførJournalføring = (
        journalpostId: string,
        journalførendeEnhet: string,
        navIdent?: string
    ) => {
        settForsøktJournalført(true);
        if (!behandling || innsending.status === RessursStatus.HENTER) {
            return;
        }

        const data: JournalføringRequest = {
            oppgaveId,
            fagsakId,
            behandling,
            dokumentTitler,
            journalførendeEnhet,
            navIdent,
        };
        settInnsending(byggHenterRessurs());
        axiosRequest<string, JournalføringRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/journalpost/${journalpostId}/fullfor`,
            data,
        }).then((resp) => settInnsending(resp));
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
