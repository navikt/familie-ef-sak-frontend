import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { useDataHenter } from './felles/useDataHenter';
import { IHistoriskPensjon } from '../typer/historiskpensjon';

export const useHentHistoriskPerson = (fagsakPersonId: string) => {
    const historiskPensjonConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/historiskpensjon/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    return useDataHenter<IHistoriskPensjon, null>(historiskPensjonConfig);
};
