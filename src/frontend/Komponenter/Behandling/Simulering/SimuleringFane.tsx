import React, { FC, useEffect, useState } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import Simulering from './Simulering';
import { SimuleringResultat as ISimulering } from './SimuleringTyper';
import { harVedtaksresultatMedTilkjentYtelse } from '../../../App/hooks/useHentVedtak';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

export const SimuleringFane: FC<Props> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const { vedtak, vedtaksresultat } = useBehandling();
    const [simuleringsresultat, settSimuleringsresultat] =
        useState<Ressurs<ISimulering>>(byggTomRessurs<ISimulering>());

    useEffect(() => {
        if (harVedtaksresultatMedTilkjentYtelse(vedtaksresultat)) {
            axiosRequest<ISimulering, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/simulering/${behandling.id}`,
            }).then((respons: Ressurs<ISimulering> | RessursFeilet) => {
                settSimuleringsresultat(respons);
            });
        }
    }, [vedtaksresultat, behandling.id, axiosRequest]);

    return (
        <DataViewer response={{ simuleringsresultat, vedtak }}>
            {({ simuleringsresultat, vedtak }) => (
                <Simulering
                    simuleringsresultat={simuleringsresultat}
                    behandlingId={behandling.id}
                    lagretVedtak={vedtak}
                />
            )}
        </DataViewer>
    );
};
