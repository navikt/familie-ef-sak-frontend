import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useMemo, useState } from 'react';
import { IJournalpostResponse } from '../typer/journalføring';
import { AxiosRequestConfig } from 'axios';
import { OrNothing } from './felles/useSorteringState';

interface HentJournalpostResponse {
    hentJournalPost: () => void;
    journalResponse: Ressurs<IJournalpostResponse>;
}

export const useHentJournalpost = (
    journalpostIdParam: OrNothing<string>
): HentJournalpostResponse => {
    const { axiosRequest } = useApp();
    const [journalResponse, settJournalResponse] =
        useState<Ressurs<IJournalpostResponse>>(byggTomRessurs());

    const hentJournalpostConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}`,
        }),
        [journalpostIdParam]
    );

    const hentJournalPost = useCallback(() => {
        settJournalResponse(byggHenterRessurs());
        axiosRequest<IJournalpostResponse, null>(hentJournalpostConfig).then(
            (res: Ressurs<IJournalpostResponse>) => settJournalResponse(res)
        );
    }, [axiosRequest, hentJournalpostConfig]);

    return {
        hentJournalPost,
        journalResponse,
    };
};
