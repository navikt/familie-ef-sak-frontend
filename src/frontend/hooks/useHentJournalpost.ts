import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IJojurnalpostResponse } from '../typer/journalforing';
import { AxiosRequestConfig } from 'axios';
import { OrNothing } from './felles/useSorteringState';

interface HentJournalpostResponse {
    hentJournalPost: () => void;
    journalResponse: Ressurs<IJojurnalpostResponse>;
}

export const useHentJournalpost = (
    journalpostIdParam: OrNothing<string>
): HentJournalpostResponse => {
    const { axiosRequest } = useApp();
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
            hentJournalpostConfig
        ).then((res: Ressurs<IJojurnalpostResponse>) => settJournalResponse(res));
    }, [hentJournalpostConfig]);

    return {
        hentJournalPost,
        journalResponse,
    };
};
