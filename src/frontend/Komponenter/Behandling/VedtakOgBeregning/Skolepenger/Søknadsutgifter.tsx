import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useMemo } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../../App/typer/ressurs';
import { ISøknadsutgifterSkolepenger } from '../../../../App/typer/beregningssøknadsdata';
import { useDataHenter } from '../../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { utledUtgiftsbeløp } from '../../../../App/utils/formatter';

const BoldTekst = styled(Label)`
    margin-left: 0.25rem;
`;

const Container = styled.div`
    width: 250px;
`;

const HøyrestiltTekst = styled(Normaltekst)`
    display: flex;
    justify-content: right;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const Grid = styled.div`
    display: grid;
    grid-template-areas: 'utgiftstype utgiftsbeløp';
    grid-template-columns: 8.5rem 5rem;
    grid-gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

export const Søknadsutgifter: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const søknadDataConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/soknad/${behandlingId}/utgifter-skolepenger`,
        }),
        [behandlingId]
    );

    const søknadDataResponse: Ressurs<ISøknadsutgifterSkolepenger> = useDataHenter<
        ISøknadsutgifterSkolepenger,
        null
    >(søknadDataConfig);

    return (
        <DataViewer response={{ søknadDataResponse }}>
            {({ søknadDataResponse }) => (
                <Container>
                    <Heading spacing size="small" level="5">
                        Utgifter fylt inn i søknad
                    </Heading>
                    <Grid>
                        <IkonOgTekstWrapper>
                            <Søknadsgrunnlag />
                            <BoldTekst size="small">Semesteravgift:</BoldTekst>
                        </IkonOgTekstWrapper>
                        <HøyrestiltTekst>
                            {utledUtgiftsbeløp(søknadDataResponse.semesteravgift)}
                        </HøyrestiltTekst>
                    </Grid>
                    <Grid>
                        <IkonOgTekstWrapper>
                            <Søknadsgrunnlag />
                            <BoldTekst size="small">Studieavgift:</BoldTekst>
                        </IkonOgTekstWrapper>
                        <HøyrestiltTekst>
                            {utledUtgiftsbeløp(søknadDataResponse.studieavgift)}
                        </HøyrestiltTekst>
                    </Grid>
                    <Grid>
                        <IkonOgTekstWrapper>
                            <Søknadsgrunnlag />
                            <BoldTekst size="small">Eksamensgebyr:</BoldTekst>
                        </IkonOgTekstWrapper>
                        <HøyrestiltTekst>
                            {utledUtgiftsbeløp(søknadDataResponse.eksamensgebyr)}
                        </HøyrestiltTekst>
                    </Grid>
                </Container>
            )}
        </DataViewer>
    );
};
