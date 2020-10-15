import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IJournalpost } from '../typer/journalforing';
import { AxiosRequestConfig } from 'axios';

export const useHentJournalpost = (journalpostIdParam?: string) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [journalpost, settJournalpost] = useState<Ressurs<IJournalpost>>(byggTomRessurs());

    const hentJournalpostConfig: AxiosRequestConfig = {
        method: 'GET',
        url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}`,
    };

    const hentJournalPost = useCallback(() => {
        settJournalpost(byggHenterRessurs());
        axiosRequest<IJournalpost, null>(
            hentJournalpostConfig,
            innloggetSaksbehandler
        ).then((res: Ressurs<IJournalpost>) => settJournalpost(res));
    }, [hentJournalpostConfig]);

    return {
        hentJournalPost,
        journalpost,
    };
};
