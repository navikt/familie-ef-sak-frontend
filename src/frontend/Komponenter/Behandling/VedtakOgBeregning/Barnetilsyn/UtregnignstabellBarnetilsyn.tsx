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

const Rad = styled.div<{ erTittelRad?: boolean }>`
    display: grid;
    grid-template-area: periode antallBarn utgifter kontantstøtte tilleggsstønad beløp notifikasjon;
    grid-template-columns: 8rem 5.5rem 4rem 6rem 7rem 10rem 2rem;
    grid-gap: 1rem;
    margin-bottom: ${(props) => (props.erTittelRad ? '0.5rem' : '0')};
`;

const HøyrejustertTekst = styled(BodyShortSmall)`
    text-align: right;
`;

const HøyrejusterElement = styled(SmallTextLabel)`
    text-align: right;
`;

const VenstrejustertElement = styled(SmallTextLabel)`
    text-align: left;
`;

const AdvarselContainter = styled.div`
    margin-top: 1rem;
    max-width: 43.5rem;
`;

export const UtregningstabellBarnetilsyn: React.FC<{
    beregningsresultat: Ressurs<IBeregningsperiodeBarnetilsyn[]>;
}> = ({ beregningsresultat }) => {
    return (
        <DataViewer response={{ beregningsresultat }}>
            {({ beregningsresultat }) => (
                <>
                    <Heading spacing size={'small'} level={'5'}>
                        Utregning
                    </Heading>
                    <Rad erTittelRad>
                        <SmallTextLabel>Periode</SmallTextLabel>
                        <HøyrejusterElement>Ant. barn</HøyrejusterElement>
                        <HøyrejusterElement>Utgifter</HøyrejusterElement>
                        <HøyrejusterElement>Kontantstøtte</HøyrejusterElement>
                        <HøyrejusterElement>Tilleggsstønad</HøyrejusterElement>
                        <HøyrejusterElement>Stønadsbeløp pr. mnd</HøyrejusterElement>
                    </Rad>
                    {beregningsresultat.map((rad) => (
                        <Rad>
                            <BodyShortSmall>
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
                                <VenstrejustertElement>
                                    <HelpText title="Hvor kommer beløpet fra?" placement={'right'}>
                                        {utledHjelpetekstForBeløpFørFratrekkOgSatsjustering(
                                            rad.beregningsgrunnlag.antallBarn,
                                            rad.beløpFørFratrekkOgSatsjustering,
                                            rad.sats
                                        )}
                                    </HelpText>
                                </VenstrejustertElement>
                            )}
                        </Rad>
                    ))}
                    {blirNullUtbetalingPgaOverstigendeKontantstøtte(beregningsresultat) && (
                        <AdvarselContainter>
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
                        </AdvarselContainter>
                    )}
                </>
            )}
        </DataViewer>
    );
};
