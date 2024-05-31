import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { AndelHistorikk } from '../typer/tilkjentytelse';
import { useDataHenter } from './felles/useDataHenter';

export const useHentAndelHistorikkPerioder = (fagsakId: string, valgtBehandling?: string) => {
    const periodeHistorikkConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/perioder/fagsak/${fagsakId}/historikk`,
            params: valgtBehandling && {
                tilOgMedBehandlingId: valgtBehandling,
            },
        }),
        [fagsakId, valgtBehandling]
    );
    const perioder = useDataHenter<AndelHistorikk[], null>(periodeHistorikkConfig);
    return { perioder };
};
