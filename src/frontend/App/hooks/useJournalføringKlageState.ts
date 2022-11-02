import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { DokumentTitler } from '../typer/journalføring';

export interface BehandlingKlageRequest {
    behandlingId?: string;
    mottattDato?: string;
}

interface JournalføringRequest {
    dokumentTitler?: DokumentTitler;
    fagsakId: string;
    oppgaveId: string;
    behandling: BehandlingKlageRequest;
    journalførendeEnhet: string;
}

export interface JournalføringKlageStateRequest {
    fagsakId: string;
    settFagsakId: Dispatch<SetStateAction<string>>;
    behandling?: BehandlingKlageRequest;
    settBehandling: Dispatch<SetStateAction<BehandlingKlageRequest | undefined>>;
    dokumentTitler?: DokumentTitler;
    settDokumentTitler: Dispatch<SetStateAction<DokumentTitler | undefined>>;
    innsending: Ressurs<string>;
    settInnsending: Dispatch<SetStateAction<Ressurs<string>>>;
    fullførJournalføring: () => void;
}

export const useJournalføringKlageState = (
    oppgaveId: string,
    journalpostId: string
): JournalføringKlageStateRequest => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingKlageRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());

    useEffect(() => {
        settBehandling(undefined);
    }, [fagsakId]);

    const fullførJournalføring = () => {
        if (!behandling || innsending.status === RessursStatus.HENTER) {
            return;
        }

        const data: JournalføringRequest = {
            oppgaveId,
            fagsakId,
            behandling,
            dokumentTitler,
            journalførendeEnhet: innloggetSaksbehandler.enhet || '9999',
        };
        settInnsending(byggHenterRessurs());
        axiosRequest<string, JournalføringRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/journalpost/${journalpostId}/klage/fullfor`,
            data,
        }).then((resp) => settInnsending(resp));
    };

    return {
        fagsakId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
        innsending,
        settInnsending,
        fullførJournalføring,
    };
};
