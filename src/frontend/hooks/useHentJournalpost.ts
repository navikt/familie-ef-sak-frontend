import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IJojurnalpostResponse } from '../typer/journalforing';
import { AxiosRequestConfig } from 'axios';
import { OrNothing } from './felles/useSorteringState';

export const useHentJournalpost = (journalpostIdParam: OrNothing<string>) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [journalResponse, settJournalResponse] = useState<Ressurs<IJojurnalpostResponse>>(
        byggTomRessurs()
    );

    const hentJournalpostConfig: AxiosRequestConfig = {
        method: 'GET',
        url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}`,
    };

    const hentJournalPost = useCallback(() => {
        settJournalResponse(byggHenterRessurs());
        axiosRequest<IJojurnalpostResponse, null>(
            hentJournalpostConfig,
            innloggetSaksbehandler
        ).then((res: Ressurs<IJojurnalpostResponse>) => settJournalResponse(res));
    }, [hentJournalpostConfig]);

    return {
        hentJournalPost,
        journalResponse,
    };
};
