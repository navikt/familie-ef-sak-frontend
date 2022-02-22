import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../App/utils/formatter';
import React, { useMemo } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../App/typer/ressurs';
import { ISøknadData } from '../../../App/typer/beregningssøknadsdata';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';

const BoldTekst = styled(Label)`
    margin-left: 1rem;
`;

const Container = styled.div`
    width: 280px;
`;

const Div = styled(FlexDiv)`
    justify-content: space-between;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
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
                    <Heading spacing size="small" level="5">
                        Søknadsinformasjon
                    </Heading>
                    <Div flexDirection="row" className="blokk-xxs">
                        <IkonOgTekstWrapper>
                            <Søknadsgrunnlag />
                            <BoldTekst size="small">Søknadsdato:</BoldTekst>
                        </IkonOgTekstWrapper>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadDataResponse.søknadsdato)}
                        </Normaltekst>
                    </Div>
                    <Div flexDirection="row" className="blokk-xxs">
                        <IkonOgTekstWrapper>
                            <Søknadsgrunnlag />
                            <BoldTekst size="small">Søker stønad fra:</BoldTekst>
                        </IkonOgTekstWrapper>
                        <Normaltekst>
                            {formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra) ||
                                'Søker ikke stønad fra bestemt tidspunkt'}
                        </Normaltekst>
                    </Div>
                </Container>
            )}
        </DataViewer>
    );
};
