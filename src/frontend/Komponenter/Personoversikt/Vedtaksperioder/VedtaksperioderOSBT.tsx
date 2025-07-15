import React, { FC, useMemo, useState } from 'react';
import { Fagsak } from '../../../App/typer/fagsak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentAndelHistorikkPerioder } from '../../../App/hooks/useHentAndelHistorikkPerioder';
import { AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { skalMarkeresSomFjernet } from '../HistorikkVedtaksperioder/vedtakshistorikkUtil';
import VedtaksperioderBarnetilsyn from '../HistorikkVedtaksperioder/VedtaksperioderBarnetilsyn';
import VedtaksperioderOvergangsstønad from '../HistorikkVedtaksperioder/VedtaksperioderOvergangsstønad';
import { filtrerOgSorterBehandlinger } from '../utils';
import TittelOgValg from './TittelOgValg';
import { finnesEnFerdigBehandling } from './utils';
import { VedtaksperiodeContainer } from './Felles/VedtaksperiodeContainer';

interface VedtaksperioderProps {
    fagsak: Fagsak;
}

const VedtaksperioderOSBT: FC<VedtaksperioderProps> = ({ fagsak }) => {
    const { id: fagsakId } = fagsak;

    const [valgtBehandlingId, settValgtBehandlingId] = useState<string>();

    const { perioder } = useHentAndelHistorikkPerioder(fagsakId, valgtBehandlingId);
    const erAktuell = (periode: AndelHistorikk) => !skalMarkeresSomFjernet(periode.endring?.type);

    const [visUaktuelle, settVisUaktuelle] = useState<boolean>(false);

    const behandlinger = useMemo(
        () => (fagsak ? filtrerOgSorterBehandlinger(fagsak) : []),
        [fagsak]
    );

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

            <DataViewer response={{ perioder }}>
                {({ perioder }) => {
                    const filtrertePerioder = visUaktuelle ? perioder : perioder.filter(erAktuell);
                    switch (fagsak.stønadstype) {
                        case Stønadstype.OVERGANGSSTØNAD:
                            return <VedtaksperioderOvergangsstønad andeler={filtrertePerioder} />;
                        case Stønadstype.BARNETILSYN:
                            return <VedtaksperioderBarnetilsyn andeler={filtrertePerioder} />;
                        default:
                            return <div>Har ikke støtte for {fagsak.stønadstype}</div>;
                    }
                }}
            </DataViewer>
        </VedtaksperiodeContainer>
    );
};

export default VedtaksperioderOSBT;
