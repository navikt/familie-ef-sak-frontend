import constate from 'constate';
import { useMemo, useState } from 'react';
import { Behandling } from '../typer/fagsak';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../typer/routing';

const [BehandlingProvider, useBehandling] = constate(() => {
    const { behandlingId } = useParams<IBehandlingParams>();
    const [stateKey, setKey] = useState(0);

    const triggerRerender = () => {
        setKey((prevKey) => prevKey + 1);
    };

    const axiosConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${behandlingId}`,
        }),
        [behandlingId, stateKey]
    );

    const behandling = useDataHenter<Behandling, undefined>(axiosConfig);

    return { behandling, triggerRerender, stateKey };
});

export { BehandlingProvider, useBehandling };
