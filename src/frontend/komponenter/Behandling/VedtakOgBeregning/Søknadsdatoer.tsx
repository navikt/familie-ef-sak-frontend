import { GridTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import { Søknadsgrunnlag } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../utils/formatter';
import React, { useMemo } from 'react';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Ressurs } from '../../../typer/ressurs';
import { ISøknadData } from '../../../typer/beregningssøknadsdata';
import { useDataHenter } from '../../../hooks/felles/useDataHenter';
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
                            {formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra) ||
                                'Søker ikke stønad fra bestemt tidspunkt'}
                        </Normaltekst>
                    </GridTabell>
                </Container>
            )}
        </DataViewer>
    );
};
