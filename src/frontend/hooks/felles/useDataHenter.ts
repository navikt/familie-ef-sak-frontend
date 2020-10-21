import { useState, useEffect, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';

type Props<D> = AxiosRequestConfig & { data?: D };

export const useDataHenter = <T, D>(config: Props<D>): Ressurs<T> => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [response, setResponse] = useState<Ressurs<T>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const hentData = useCallback(() => {
        setResponse({ status: RessursStatus.HENTER });
        axiosRequest<T, D>(config, innloggetSaksbehandler).then((res: Ressurs<T>) =>
            setResponse(res)
        );
    }, [config]);

    useEffect(() => {
        hentData();
    }, [hentData]);

    return response;
};
