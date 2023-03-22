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
    className?: string;
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    column-gap: 1rem;

    .tittel-rad {
        display: contents;
    }

    .tittel-rad > p {
        margin-bottom: 0.5rem;
    }
`;

const HøyrejustertTekst = styled(BodyShortSmall)`
    text-align: right;
`;

const Utregningstabell: React.FC<Props> = ({ beregnetStønad, className }) => {
    return (
        <DataViewer response={{ beregnetStønad }}>
            {({ beregnetStønad }) => {
                return (
                    <div className={className}>
                        <Heading spacing size="small" level="5">
                            Utregning
                        </Heading>
                        <Grid>
                            <div className="tittel-rad">
                                <SmallTextLabel>Periode</SmallTextLabel>
                                <SmallTextLabel>Årsinntekt etter avrunding</SmallTextLabel>
                                <SmallTextLabel>Beløp før samordning</SmallTextLabel>
                                <SmallTextLabel>Samordningsfradrag (mnd)</SmallTextLabel>
                                <SmallTextLabel>Stønadsbeløp pr. mnd</SmallTextLabel>
                            </div>
                            {beregnetStønad.map((beløpsPeriode) => {
                                return (
                                    <React.Fragment key={beløpsPeriode.periode.fradato}>
                                        <BodyShortSmall>
                                            {`${formaterNullableMånedÅr(
                                                beløpsPeriode.periode.fradato
                                            )} - ${formaterNullableMånedÅr(
                                                beløpsPeriode.periode.tildato
                                            )}`}
                                        </BodyShortSmall>
                                        <HøyrejustertTekst>
                                            {formaterTallMedTusenSkille(
                                                beløpsPeriode.beregningsgrunnlag.inntekt
                                            )}
                                        </HøyrejustertTekst>
                                        <HøyrejustertTekst>
                                            {formaterTallMedTusenSkille(
                                                beløpsPeriode.beløpFørSamordning
                                            )}
                                        </HøyrejustertTekst>
                                        <HøyrejustertTekst>
                                            {formaterTallMedTusenSkille(
                                                beløpsPeriode.beregningsgrunnlag.samordningsfradrag
                                            )}
                                        </HøyrejustertTekst>
                                        <HøyrejustertTekst>
                                            {formaterTallMedTusenSkille(beløpsPeriode.beløp)}
                                        </HøyrejustertTekst>
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                    </div>
                );
            }}
        </DataViewer>
    );
};

export default Utregningstabell;
