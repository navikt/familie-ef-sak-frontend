import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBehandlingResultat } from '../../../App/typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from './SelectVedtaksresultat';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';

interface Props {
    behandling: Behandling;
}

const Wrapper = styled.div`
    padding: 4rem 2rem;
`;
const VedtakOgBeregning: FC<Props> = ({ behandling }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS && vedtak.data) {
            settResultatType(vedtak.data.resultatType);
        }
    }, [vedtak]);

    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => {
                return (
                    <Wrapper>
                        <SelectVedtaksresultat
                            behandling={behandling}
                            resultatType={resultatType}
                            settResultatType={settResultatType}
                        />
                        <VedtaksresultatSwitch
                            vedtaksresultatType={resultatType}
                            behandling={behandling}
                            lagretVedtak={vedtak}
                        />
                    </Wrapper>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
