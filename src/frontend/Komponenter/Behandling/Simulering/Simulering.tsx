import React, { FC, useEffect, useState } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import SimuleringTabellWrapper from './SimuleringTabellWrapper';
import { ISimulering } from './SimuleringTyper';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';

export const Simulering: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { harVedtaksresultatMedTilkjentYtelse, hentVedtak, vedtaksresultat } =
        useHentVedtak(behandlingId);
    const [simuleringsresultat, settSimuleringsresultat] = useState<Ressurs<ISimulering>>(
        byggTomRessurs()
    );

    useEffect(() => {
        if (harVedtaksresultatMedTilkjentYtelse()) {
            axiosRequest<ISimulering, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/simulering/${behandlingId}`,
            }).then((respons: Ressurs<ISimulering> | RessursFeilet) => {
                settSimuleringsresultat(respons);
            });
        }
    }, [vedtaksresultat, harVedtaksresultatMedTilkjentYtelse, behandlingId, axiosRequest]);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <SimuleringTabellWrapper simuleringsresultat={simuleringsresultat} />
            )}
        </DataViewer>
    );
};
