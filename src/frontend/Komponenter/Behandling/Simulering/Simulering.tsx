import React, { FC, useMemo } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import SimuleringTabellWrapper from './SimuleringTabellWrapper';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { ISimulering } from './SimuleringTyper';
import { AxiosRequestConfig } from 'axios';

export const Simulering: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const simuleringConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/simulering/${behandlingId}`,
        }),
        [behandlingId]
    );
    const simuleringsresultat = useDataHenter<ISimulering, null>(simuleringConfig);

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <SimuleringTabellWrapper simuleringsresultat={simuleringsresultat} />
            )}
        </DataViewer>
    );
};
