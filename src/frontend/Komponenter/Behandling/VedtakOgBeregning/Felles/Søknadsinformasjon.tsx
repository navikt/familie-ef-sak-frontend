import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../../App/utils/formatter';
import React, { useMemo } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../../App/typer/ressurs';
import { ISøknadsdato } from '../../../../App/typer/beregningssøknadsdata';
import { useDataHenter } from '../../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { BodyShort, Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

const BoldTekst = styled(BodyShortSmall)`
    margin-left: 0.25rem;
`;

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Bodyshort = styled(BodyShort)`
    justify-self: end;
`;

const ResultatGrid = styled.div`
    display: grid;
    grid-template-columns: 8.5rem 7.25rem;
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const Søknadsinformasjon: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const søknadDataConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/soknad/${behandlingId}/datoer`,
        }),
        [behandlingId]
    );

    const søknadDataResponse: Ressurs<ISøknadsdato> = useDataHenter<ISøknadsdato, null>(
        søknadDataConfig
    );

    return (
        <DataViewer response={{ søknadDataResponse }}>
            {({ søknadDataResponse }) => {
                const månedÅrEllerNull = formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra);
                return (
                    <Container>
                        <Heading spacing size="small">
                            Søknadsinformasjon
                        </Heading>
                        <ResultatGrid>
                            <IkonOgTekstWrapper>
                                <Søknadsgrunnlag />
                                <BoldTekst>Søknadsdato:</BoldTekst>
                            </IkonOgTekstWrapper>
                            <Bodyshort size="small">
                                {formaterNullableIsoDato(søknadDataResponse.søknadsdato)}
                            </Bodyshort>
                        </ResultatGrid>
                        <ResultatGrid>
                            <IkonOgTekstWrapper>
                                <Søknadsgrunnlag />
                                <BoldTekst>Søker stønad fra:</BoldTekst>
                            </IkonOgTekstWrapper>
                            {månedÅrEllerNull && (
                                <Bodyshort size="small">{månedÅrEllerNull}</Bodyshort>
                            )}
                        </ResultatGrid>
                        {!månedÅrEllerNull && (
                            <Bodyshort size="small">
                                Søker ikke stønad fra bestemt tidspunkt
                            </Bodyshort>
                        )}
                    </Container>
                );
            }}
        </DataViewer>
    );
};
