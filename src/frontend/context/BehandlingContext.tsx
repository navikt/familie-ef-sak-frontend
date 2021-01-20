import constate from 'constate';
import { useMemo, useState } from 'react';
import { Behandling } from '../typer/fagsak';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { AxiosRequestConfig } from 'axios';

const [BehandlingProvider, useBehandlingProvider] = constate((props: { behandlingId: string }) => {
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());

    const axiosConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${props.behandlingId}`,
        }),
        [props.behandlingId]
    );

    const behandlingResponse = useDataHenter<Behandling, undefined>(axiosConfig);

    settBehandling(behandlingResponse);

    return { behandling };
});

export { BehandlingProvider, useBehandlingProvider };
