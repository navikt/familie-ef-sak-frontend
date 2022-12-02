import React from 'react';
import DataViewer from '../../../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../../../App/typer/ressurs';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../../App/utils/formatter';
import { IBeløpsperiode } from '../../../../../App/typer/vedtak';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall, SmallTextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    beregnetStønad: Ressurs<IBeløpsperiode[]>;
}

const InnholdContainer = styled.div`
    display: grid;
    grid-template-area: periode inntekt beløpFørSamordning samordningsfradrag stønadsbeløp;
    grid-template-columns: 8rem 5.5rem 10rem 12rem 10rem;
    grid-gap: 1rem;
`;

const TittelContainer = styled.div`
    display: grid;
    grid-template-area: periode inntekt beløpFørSamordning samordningsfradrag stønadsbeløp;
    grid-template-columns: 8rem 5.5rem 10rem 12rem 10rem;
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const Utregningstabell: React.FC<Props> = ({ beregnetStønad }) => {
    return (
        <DataViewer response={{ beregnetStønad }}>
            {({ beregnetStønad }) => {
                return (
                    <>
                        <Heading spacing size="small" level="5">
                            Utregning
                        </Heading>
                        <TittelContainer>
                            <SmallTextLabel>Periode</SmallTextLabel>
                            <SmallTextLabel>Inntekt (år)</SmallTextLabel>
                            <SmallTextLabel>Beløp før samordning</SmallTextLabel>
                            <SmallTextLabel>Samordningsfradrag (mnd)</SmallTextLabel>
                            <SmallTextLabel>Stønadsbeløp pr. mnd</SmallTextLabel>
                        </TittelContainer>
                        {beregnetStønad.map((beløpsPeriode) => {
                            return (
                                <InnholdContainer>
                                    <BodyShortSmall>
                                        {`${formaterNullableMånedÅr(
                                            beløpsPeriode.periode.fradato
                                        )} - ${formaterNullableMånedÅr(
                                            beløpsPeriode.periode.tildato
                                        )}`}
                                    </BodyShortSmall>
                                    <BodyShortSmall>
                                        {formaterTallMedTusenSkille(
                                            beløpsPeriode.beregningsgrunnlag.inntekt
                                        )}
                                    </BodyShortSmall>
                                    <BodyShortSmall>
                                        {formaterTallMedTusenSkille(
                                            beløpsPeriode.beløpFørSamordning
                                        )}
                                    </BodyShortSmall>
                                    <BodyShortSmall>
                                        {formaterTallMedTusenSkille(
                                            beløpsPeriode.beregningsgrunnlag.samordningsfradrag
                                        )}
                                    </BodyShortSmall>
                                    <BodyShortSmall>
                                        {formaterTallMedTusenSkille(beløpsPeriode.beløp)}
                                    </BodyShortSmall>
                                </InnholdContainer>
                            );
                        })}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Utregningstabell;
