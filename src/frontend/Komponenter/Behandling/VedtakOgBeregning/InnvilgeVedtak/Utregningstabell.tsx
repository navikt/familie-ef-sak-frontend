import React from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../../App/typer/ressurs';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../App/utils/formatter';
import { IBeløpsperiode } from '../../../../App/typer/vedtak';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';

interface Props {
    beregnetStønad: Ressurs<IBeløpsperiode[]>;
}

const InnholdContainer = styled.div`
    display: grid;
    grid-template-area: periode inntekt beløpFørSamordning samordningsfradrag stønadsbeløp;
    grid-template-columns: 8rem 5.5rem 10rem 12rem 8rem;
    grid-gap: 1rem;
`;

const TittelContainer = styled.div`
    display: grid;
    grid-template-area: periode inntekt beløpFørSamordning samordningsfradrag stønadsbeløp;
    grid-template-columns: 8rem 5.5rem 10rem 12rem 8rem;
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const Utregningstabell: React.FC<Props> = ({ beregnetStønad }) => {
    return (
        <DataViewer response={{ beregnetStønad }}>
            {({ beregnetStønad }) => {
                return (
                    <>
                        <TittelContainer>
                            <Element>Periode</Element>
                            <Element>Inntekt (år)</Element>
                            <Element>Beløp før samordning</Element>
                            <Element>Samordningsfradrag (mnd)</Element>
                            <Element>Stønadsbeløp</Element>
                        </TittelContainer>
                        {beregnetStønad.map((beløpsPeriode) => {
                            return (
                                <InnholdContainer>
                                    <Normaltekst>
                                        {`${formaterNullableMånedÅr(
                                            beløpsPeriode.periode.fradato
                                        )} - ${formaterNullableMånedÅr(
                                            beløpsPeriode.periode.tildato
                                        )}`}
                                    </Normaltekst>
                                    <Normaltekst>
                                        {formaterTallMedTusenSkille(
                                            beløpsPeriode.beregningsgrunnlag.inntekt
                                        )}
                                    </Normaltekst>
                                    <Normaltekst>
                                        {formaterTallMedTusenSkille(
                                            beløpsPeriode.beløpFørSamordning
                                        )}
                                    </Normaltekst>
                                    <Normaltekst>
                                        {formaterTallMedTusenSkille(
                                            beløpsPeriode.beregningsgrunnlag.samordningsfradrag
                                        )}
                                    </Normaltekst>
                                    <Normaltekst>
                                        {formaterTallMedTusenSkille(beløpsPeriode.beløp)}
                                    </Normaltekst>
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
