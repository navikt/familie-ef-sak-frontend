import { AxiosRequestConfig } from 'axios';
import React, { FC, useMemo, useState } from 'react';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IVedtakForSkolepenger } from '../../../App/typer/vedtak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import VedtaksperioderSkolepenger from '../HistorikkVedtaksperioder/VedtaksperioderSkolepeger';
import { Fagsak } from '../../../App/typer/fagsak';
import { filtrerOgSorterBehandlinger } from '../utils';
import TittelOgValg from './TittelOgValg';
import { finnesEnFerdigBehandling } from './utils';
import { VedtaksperiodeContainer } from './Felles/VedtaksperiodeContainer';

export const VedtaksperioderSP: FC<{
    fagsak: Fagsak;
}> = ({ fagsak }) => {
    const [valgtBehandlingId, settValgtBehandlingId] = useState<string>();

    const [visUaktuelle, settVisUaktuelle] = useState<boolean>(false);

    const behandlinger = useMemo(
        () => (fagsak ? filtrerOgSorterBehandlinger(fagsak) : []),
        [fagsak]
    );

    const defaultBehandlingId = valgtBehandlingId ?? behandlinger[0]?.id;

    const requestConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${defaultBehandlingId}`,
        }),
        [defaultBehandlingId]
    );
    const vedtak = useDataHenter<IVedtakForSkolepenger, null>(requestConfig);

    if (!finnesEnFerdigBehandling(fagsak)) {
        return;
    }

    return (
        <VedtaksperiodeContainer>
            <TittelOgValg
                fagsak={fagsak}
                valgtFagsak={fagsak}
                behandlinger={behandlinger}
                settValgtBehandlingId={settValgtBehandlingId}
                visUaktuelle={visUaktuelle}
                settVisUaktuelle={settVisUaktuelle}
            />

            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => <VedtaksperioderSkolepenger vedtak={vedtak} />}
            </DataViewer>
        </VedtaksperiodeContainer>
    );
};
