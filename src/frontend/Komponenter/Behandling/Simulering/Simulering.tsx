import React, { FC, useEffect, useState } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import SimuleringSide from './SimuleringSide';
import { Simulering as ISimulering } from './SimuleringTyper';
import { harVedtaksresultatMedTilkjentYtelse } from '../../../App/hooks/useHentVedtak';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';

export const Simulering: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { vedtak, vedtaksresultat } = useBehandling();
    const [simuleringsresultat, settSimuleringsresultat] =
        useState<Ressurs<ISimulering>>(byggTomRessurs<ISimulering>());

    useEffect(() => {
        if (harVedtaksresultatMedTilkjentYtelse(vedtaksresultat)) {
            axiosRequest<ISimulering, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/simulering/${behandlingId}`,
            }).then((respons: Ressurs<ISimulering> | RessursFeilet) => {
                settSimuleringsresultat(respons);
            });
        }
    }, [vedtaksresultat, behandlingId, axiosRequest]);

    return (
        <DataViewer response={{ simuleringsresultat, vedtak }}>
            {({ simuleringsresultat, vedtak }) => (
                <SimuleringSide
                    simuleringsresultat={simuleringsresultat}
                    behandlingId={behandlingId}
                    lagretVedtak={vedtak}
                />
            )}
        </DataViewer>
    );
};
