import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../../App/utils/formatter';
import React, { useMemo } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../../App/typer/ressurs';
import { ISøknadsdato } from '../../../../App/typer/beregningssøknadsdata';
import { useDataHenter } from '../../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

const BoldTekst = styled(Label)`
    margin-left: 0.25rem;
`;

const Container = styled.div<{ stønadstype: Stønadstype }>`
    width: ${(p) => (p.stønadstype === Stønadstype.OVERGANGSSTØNAD ? '280px' : '300px')};
`;

const Div = styled(FlexDiv)`
    justify-content: space-between;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const Søknadsdatoer: React.FC<{ behandlingId: string; stønadstype: Stønadstype }> = ({
    behandlingId,
    stønadstype,
}) => {
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
            {({ søknadDataResponse }) => (
                <Container stønadstype={stønadstype}>
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
