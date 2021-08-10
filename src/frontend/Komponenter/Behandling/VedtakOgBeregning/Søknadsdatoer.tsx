import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../App/utils/formatter';
import React, { useMemo } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../App/typer/ressurs';
import { ISøknadData } from '../../../App/typer/beregningssøknadsdata';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    padding: 2rem;
`;

export const Søknadsdatoer: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
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
            {({ søknadDataResponse }) => (
                <Container>
                    <Undertittel className={'blokk-xs'}>Søknadsinformasjon</Undertittel>
                    <GridTabell gridGap={0.5} style={{ marginBottom: '2rem' }}>
                        <Søknadsgrunnlag />
                        <Normaltekst>Søknadsdato</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadDataResponse.søknadsdato)}
                        </Normaltekst>
                        <Søknadsgrunnlag />
                        <Normaltekst>Søker stønad fra</Normaltekst>
                        <Normaltekst>
                            {formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra) ||
                                'Søker ikke stønad fra bestemt tidspunkt'}
                        </Normaltekst>
                    </GridTabell>
                </Container>
            )}
        </DataViewer>
    );
};
