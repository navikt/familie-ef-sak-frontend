import React, { FC } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useSimulering } from '../../../App/hooks/useSimulering';

export const Simulering: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { simuleringsresultat } = useSimulering(behandlingId);

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => <div>{simuleringsresultat.toString()}</div>}
        </DataViewer>
    );
};
