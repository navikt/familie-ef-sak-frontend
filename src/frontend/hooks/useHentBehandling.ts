import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { Behandling } from '../typer/fagsak';
import { AxiosRequestConfig } from 'axios';

export const useHentBehandling = (
    behandlingId?: string
): {
    hentBehandlingCallback: (behandlingsid: string) => void;
    behandling: Ressurs<Behandling>;
} => {
    const { axiosRequest } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());

    const hentBehandlingCallback = useCallback(() => {
        if (!behandlingId) return;
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${behandlingId}`,
        };
        axiosRequest<Behandling, null>(behandlingConfig).then((res: Ressurs<Behandling>) =>
            settBehandling(res)
        );
    }, [behandlingId]);

    return {
        hentBehandlingCallback,
        behandling,
    };
};
