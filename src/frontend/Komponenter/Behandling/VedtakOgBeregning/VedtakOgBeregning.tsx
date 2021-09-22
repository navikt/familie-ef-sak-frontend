import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { EBehandlingResultat, IVedtak } from '../../../App/typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from './SelectVedtaksresultat';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

const Wrapper = styled.div`
    padding: 4rem 2rem;
`;
const VedtakOgBeregning: FC<Props> = ({ behandling }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();

    const lagretVedtakConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}`,
        }),
        [behandlingId]
    );

    const lagretVedtakResponse: Ressurs<IVedtak | undefined> = useDataHenter<
        IVedtak | undefined,
        null
    >(lagretVedtakConfig);

    useEffect(() => {
        if (lagretVedtakResponse.status === RessursStatus.SUKSESS && lagretVedtakResponse.data) {
            settResultatType(lagretVedtakResponse.data.resultatType);
        }
    }, [lagretVedtakResponse]);

    return (
        <DataViewer response={{ lagretVedtakResponse }}>
            {({ lagretVedtakResponse }) => {
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
                            lagretVedtak={lagretVedtakResponse}
                        />
                    </Wrapper>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
