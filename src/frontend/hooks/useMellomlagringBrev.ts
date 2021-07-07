import { useApp } from '../context/AppContext';
import { useCallback } from 'react';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import { AxiosRequestConfig } from 'axios';

export const useMellomlagringBrev = (brevstate: any) => {
    const { axiosRequest } = useApp();

    const mellomlagreBrev = useCallback(() => {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: '/familie-ef-sak/api/brev/mellomlager',
            data: brevstate,
        };
        axiosRequest<string, null>(config).then((res: Ressurs<string>) => {
            console.log(res);
        });
    }, []);

    const hentMellomlagretBrev = useCallback(() => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: '/familie-ef-sak/api/brev/mellomlager',
        };

        axiosRequest<any, null>(config).then((res: Ressurs<any>) => {
            return res.status === RessursStatus.SUKSESS && res.data;
        });
    }, []);

    return {
        mellomlagreBrev,
        hentMellomlagretBrev,
    };
};
