import { useState, useCallback } from 'react';
import { Behandling } from '../typer/fagsak';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useApp } from '../context/AppContext';

export const useHentBehandlinger = (behandlingId: string) => {
    const [behandlinger, settBehandlinger] = useState<Ressurs<Behandling[]>>(byggTomRessurs());

    const { axiosRequest } = useApp();

    const hentBehandlingerCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/gjenbruk/${behandlingId}`,
        };
        axiosRequest<Behandling[], null>(behandlingConfig).then((res: Ressurs<Behandling[]>) =>
            settBehandlinger(res)
        );
    }, [axiosRequest, behandlingId]);

    return {
        hentBehandlingerCallback,
        behandlinger,
    };
};
