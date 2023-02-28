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

const InnholdRad = styled.div`
    display: grid;
    grid-template-columns: 8rem 5.5rem 4rem 6rem 7rem 10rem 2rem;
    grid-gap: 1rem;
    margin-left: 1rem;
`;

const TittelRad = styled(InnholdRad)`
    margin-bottom: 0.5rem;
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
    className?: string;
}> = ({ beregningsresultat, className }) => {
    return (
        <DataViewer response={{ beregningsresultat }}>
            {({ beregningsresultat }) => (
                <div className={className}>
                    <Heading spacing size={'small'} level={'5'}>
                        Utregning
                    </Heading>
                    <TittelRad>
                        <SmallTextLabel>Periode</SmallTextLabel>
                        <HøyrejusterElement>Ant. barn</HøyrejusterElement>
                        <HøyrejusterElement>Utgifter</HøyrejusterElement>
                        <HøyrejusterElement>Kontantstøtte</HøyrejusterElement>
                        <HøyrejusterElement>Tilleggsstønad</HøyrejusterElement>
                        <HøyrejusterElement>Stønadsbeløp pr. mnd</HøyrejusterElement>
                    </TittelRad>
                    {beregningsresultat.map((rad) => (
                        <InnholdRad>
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
                        </InnholdRad>
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
                </div>
            )}
        </DataViewer>
    );
};
