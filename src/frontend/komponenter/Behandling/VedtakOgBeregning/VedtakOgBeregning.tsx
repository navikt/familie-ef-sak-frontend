import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Ressurs } from '../../../typer/ressurs';
import { GridTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../utils/formatter';
import { Søknadsgrunnlag } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ISøknadData } from '../../../typer/beregningssøknadsdata';
import { useDataHenter } from '../../../hooks/felles/useDataHenter';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { EBehandlingResultat } from '../../../typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import VelgVedtaksresultat from './VelgVedtaksresultat';

interface Props {
    behandlingId: string;
}

const StyledInntekt = styled.div`
    padding: 2rem;
`;

const StyledFeilmelding = styled(AlertStripeFeil)`
    margin-top: 2rem;
`;

const VedtakOgBeregning: FC<Props> = ({ behandlingId }) => {
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const [feilmelding, settFeilmelding] = useState<string>('');

    const søknadDataConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/soknad/${behandlingId}/datoer`,
        }),
        [behandlingId]
    );

    const søknadDataResponse: Ressurs<ISøknadData> = useDataHenter<ISøknadData, null>(
        søknadDataConfig
    );

    return (
        <DataViewer response={{ søknadDataResponse }}>
            {({ søknadDataResponse }) => {
                return (
                    <StyledInntekt>
                        <Element style={{ marginBottom: '0.5rem' }}>Søknadsinformasjon</Element>
                        <GridTabell style={{ marginBottom: '2rem' }}>
                            <Søknadsgrunnlag />
                            <Normaltekst>Søknadsdato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadDataResponse.søknadsdato)}
                            </Normaltekst>
                            <Søknadsgrunnlag />
                            <Normaltekst>Søker stønad fra</Normaltekst>
                            <Normaltekst>
                                {formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra)}
                            </Normaltekst>
                        </GridTabell>
                        <VelgVedtaksresultat
                            resultatType={resultatType}
                            settFeilmelding={settFeilmelding}
                            settResultatType={settResultatType}
                        />
                        {resultatType && (
                            <VedtaksresultatSwitch
                                vedtaksresultatType={resultatType}
                                behandlingId={behandlingId}
                                settFeilmelding={settFeilmelding}
                            />
                        )}
                        {feilmelding && <StyledFeilmelding>{feilmelding}</StyledFeilmelding>}
                    </StyledInntekt>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
