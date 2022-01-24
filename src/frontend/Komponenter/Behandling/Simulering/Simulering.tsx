import React, { FC, useEffect, useState } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import SimuleringTabellWrapper from './SimuleringTabellWrapper';
import { ISimulering } from './SimuleringTyper';
import {
    harVedtaksresultatMedTilkjentYtelse,
    useHentVedtak,
} from '../../../App/hooks/useHentVedtak';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';

export const Simulering: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { hentVedtak, vedtaksresultat } = useHentVedtak(behandlingId);
    const [simuleringsresultat, settSimuleringsresultat] = useState<Ressurs<ISimulering>>(
        byggTomRessurs()
    );

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

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <SimuleringTabellWrapper
                    simuleringsresultat={simuleringsresultat}
                    behandlingId={behandlingId}
                />
            )}
        </DataViewer>
    );
};
