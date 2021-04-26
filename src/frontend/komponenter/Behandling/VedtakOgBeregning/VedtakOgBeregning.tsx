import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { useDataHenter } from '../../../hooks/felles/useDataHenter';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { EBehandlingResultat, IVedtak } from '../../../typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import VelgVedtaksresultat from './VelgVedtaksresultat';
import { Behandling } from '../../../typer/fagsak';

interface Props {
    behandling: Behandling;
}

const StyledVedtaksperiode = styled.div`
    padding: 2rem;
`;

const StyledFeilmelding = styled(AlertStripeFeil)`
    margin-top: 2rem;
`;

const VedtakOgBeregning: FC<Props> = ({ behandling }) => {
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const behandlingId = behandling.id;

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
                    <StyledVedtaksperiode>
                        <VelgVedtaksresultat
                            resultatType={resultatType}
                            settFeilmelding={settFeilmelding}
                            settResultatType={settResultatType}
                        />
                        {resultatType && (
                            <VedtaksresultatSwitch
                                vedtaksresultatType={resultatType}
                                behandling={behandling}
                                settFeilmelding={settFeilmelding}
                                lagretVedtak={lagretVedtakResponse}
                            />
                        )}
                        {feilmelding && <StyledFeilmelding>{feilmelding}</StyledFeilmelding>}
                    </StyledVedtaksperiode>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
