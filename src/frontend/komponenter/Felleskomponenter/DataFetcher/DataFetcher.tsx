import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { AxiosRequestConfig } from 'axios';

interface DataFetcherProps<T, D> {
    config: AxiosRequestConfig & { data?: D };
    children: (data: T) => React.ReactElement;
}

//OBS ATT CONFIGEN MÅSTE VARA MEMOIZED!

function DataFetcher<T, D>(props: DataFetcherProps<T, D>) {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [response, setResponse] = useState<Ressurs<T>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const hentData = useCallback(() => {
        setResponse({ status: RessursStatus.HENTER });
        axiosRequest<T, D>(props.config, innloggetSaksbehandler).then((res: Ressurs<T>) =>
            setResponse(res)
        );
    }, [props.config]);

    useEffect(() => {
        hentData();
    }, [hentData]);

    if (response.status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (response.status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (response.status === RessursStatus.FEILET) {
        return <AlertStripeFeil children="Noe gikk galt" />;
    } else if (response.status === RessursStatus.IKKE_HENTET) {
        return null;
    }

    return props.children(response.data);
}

export default DataFetcher;
