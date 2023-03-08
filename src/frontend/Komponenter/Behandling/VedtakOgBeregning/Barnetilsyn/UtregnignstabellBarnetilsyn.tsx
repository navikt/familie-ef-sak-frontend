import React from 'react';
import { IBeregningsperiodeBarnetilsyn } from '../../../../App/typer/vedtak';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Alert, Heading, HelpText } from '@navikt/ds-react';
import styled from 'styled-components';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../App/utils/formatter';
import {
    blirNullUtbetalingPgaOverstigendeKontantstøtte,
    utledHjelpetekstForBeløpFørFratrekkOgSatsjustering,
} from '../Felles/utils';
import {
    BodyLongSmall,
    BodyShortSmall,
    SmallTextLabel,
} from '../../../../Felles/Visningskomponenter/Tekster';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 46rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, max-content);
    column-gap: 1rem;
    padding-left: 1rem;

    .tittel-rad {
        display: contents;
    }

    .tittel-rad > p {
        margin-bottom: 0.5rem;
    }

    .ny-rad {
        grid-column: 1;
    }
`;

const HøyrejustertTekst = styled(BodyShortSmall)`
    text-align: right;
`;

export const UtregningstabellBarnetilsyn: React.FC<{
    beregningsresultat: Ressurs<IBeregningsperiodeBarnetilsyn[]>;
    className?: string;
}> = ({ beregningsresultat, className }) => {
    return (
        <DataViewer response={{ beregningsresultat }}>
            {({ beregningsresultat }) => (
                <Container className={className}>
                    <Heading size={'small'} level={'5'}>
                        Utregning
                    </Heading>
                    <Grid>
                        <div className={'tittel-rad'}>
                            <SmallTextLabel>Periode</SmallTextLabel>
                            <SmallTextLabel>Ant. barn</SmallTextLabel>
                            <SmallTextLabel>Utgifter</SmallTextLabel>
                            <SmallTextLabel>Kontantstøtte</SmallTextLabel>
                            <SmallTextLabel>Tilleggsstønad</SmallTextLabel>
                            <SmallTextLabel>Stønadsbeløp pr. mnd</SmallTextLabel>
                        </div>
                        {beregningsresultat.map((rad) => (
                            <React.Fragment key={rad.periode.fradato}>
                                <BodyShortSmall className={'ny-rad'}>
                                    {`${formaterNullableMånedÅr(
                                        rad.periode.fradato
                                    )} - ${formaterNullableMånedÅr(rad.periode.tildato)}`}
                                </BodyShortSmall>
                                <HøyrejustertTekst>
                                    {rad.beregningsgrunnlag.antallBarn}
                                </HøyrejustertTekst>
                                <HøyrejustertTekst>
                                    {formaterTallMedTusenSkille(rad.beregningsgrunnlag.utgifter)}
                                </HøyrejustertTekst>
                                <HøyrejustertTekst>
                                    {formaterTallMedTusenSkille(
                                        rad.beregningsgrunnlag.kontantstøttebeløp
                                    )}
                                </HøyrejustertTekst>
                                <HøyrejustertTekst>
                                    {formaterTallMedTusenSkille(
                                        rad.beregningsgrunnlag.tilleggsstønadsbeløp
                                    )}
                                </HøyrejustertTekst>
                                <HøyrejustertTekst>
                                    {formaterTallMedTusenSkille(rad.beløp)}
                                </HøyrejustertTekst>
                                {rad.beløpFørFratrekkOgSatsjustering > rad.sats && (
                                    <HelpText title="Hvor kommer beløpet fra?" placement={'right'}>
                                        {utledHjelpetekstForBeløpFørFratrekkOgSatsjustering(
                                            rad.beregningsgrunnlag.antallBarn,
                                            rad.beløpFørFratrekkOgSatsjustering,
                                            rad.sats
                                        )}
                                    </HelpText>
                                )}
                            </React.Fragment>
                        ))}
                    </Grid>
                    {blirNullUtbetalingPgaOverstigendeKontantstøtte(beregningsresultat) ||
                        (blirNullUtbetalingPgaOverstigendeKontantstøtte(beregningsresultat) && (
                            <Alert variant={'warning'} size={'medium'}>
                                <Heading spacing size="xsmall" level="5">
                                    Avslag/Opphør - kontantstøtte overstiger tilsynsutgifter.
                                </Heading>
                                <BodyLongSmall>
                                    Siden kontantstøttebeløpet overstiger utgiftsbeløpet er
                                    vedtaksresultatet automatisk endret til "Avslag/opphør pga
                                    kontantstøtte"
                                </BodyLongSmall>
                            </Alert>
                        ))}
                </Container>
            )}
        </DataViewer>
    );
};
