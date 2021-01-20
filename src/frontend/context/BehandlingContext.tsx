import constate from 'constate';
import { useMemo } from 'react';
import { Behandling } from '../typer/fagsak';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';

const [BehandlingProvider, useBehandling] = constate((props: { behandlingId: string }) => {
    const axiosConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${props.behandlingId}`,
        }),
        [props.behandlingId]
    );

    const behandling = useDataHenter<Behandling, undefined>(axiosConfig);

    return { behandling };
});

export { BehandlingProvider, useBehandling };
