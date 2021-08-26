import React, { FC } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useSimulering } from '../../../App/hooks/useSimulering';
import SimuleringTabellWrapper from './SimuleringTabellWrapper';

export const Simulering: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { simuleringsresultat } = useSimulering(behandlingId);

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <SimuleringTabellWrapper simuleringsresultat={simuleringsresultat} />
            )}
        </DataViewer>
    );
};
