import React from 'react';
import { IBeregningsperiodeBarnetilsyn } from '../../../../App/typer/vedtak';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Alert, Heading, HelpText } from '@navikt/ds-react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../App/utils/formatter';
import {
    blirNullUtbetalingPgaOverstigendeKontantstøtte,
    utledHjelpetekstForBeløpFørFratrekkOgSatsjustering,
} from '../Felles/utils';

const Rad = styled.div<{ erTittelRad?: boolean }>`
    display: grid;
    grid-template-area: periode antallBarn utgifter kontantstøtte tilleggsstønad beløp notifikasjon;
    grid-template-columns: 8rem 5.5rem 4rem 6rem 7rem 10rem 2rem;
    grid-gap: 1rem;
    margin-bottom: ${(props) => (props.erTittelRad ? '0.5rem' : '0')};
`;

const HøyrejustertNormaltekst = styled(Normaltekst)`
    text-align: right;
`;

const HøyrejusterElement = styled(Element)`
    text-align: right;
`;

const VenstrejustertElement = styled(Element)`
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
                        <Element>Periode</Element>
                        <HøyrejusterElement>Ant. barn</HøyrejusterElement>
                        <HøyrejusterElement>Utgifter</HøyrejusterElement>
                        <HøyrejusterElement>Kontantstøtte</HøyrejusterElement>
                        <HøyrejusterElement>Tilleggsstønad</HøyrejusterElement>
                        <HøyrejusterElement>Stønadsbeløp pr. mnd</HøyrejusterElement>
                    </Rad>
                    {beregningsresultat.map((rad) => (
                        <Rad>
                            <Normaltekst>
                                {`${formaterNullableMånedÅr(
                                    rad.periode.fradato
                                )} - ${formaterNullableMånedÅr(rad.periode.tildato)}`}
                            </Normaltekst>
                            <HøyrejustertNormaltekst>
                                {rad.beregningsgrunnlag.antallBarn}
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {formaterTallMedTusenSkille(rad.beregningsgrunnlag.utgifter)}
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {formaterTallMedTusenSkille(
                                    rad.beregningsgrunnlag.kontantstøttebeløp
                                )}
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {formaterTallMedTusenSkille(
                                    rad.beregningsgrunnlag.tilleggsstønadsbeløp
                                )}
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {formaterTallMedTusenSkille(rad.beløp)}
                            </HøyrejustertNormaltekst>
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
                                <Normaltekst>
                                    Siden kontantstøttebeløpet overstiger utgiftsbeløpet er
                                    vedtaksresultatet automatisk endret til "Avslag/opphør pga
                                    kontantstøtte"
                                </Normaltekst>
                            </Alert>
                        </AdvarselContainter>
                    )}
                </>
            )}
        </DataViewer>
    );
};
