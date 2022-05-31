import React from 'react';
import {
    IBeregningsperiodeSkolepenger,
    skolepengerStudietypeTilTekst,
} from '../../../../App/typer/vedtak';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../App/utils/formatter';

const Rad = styled.div<{ erTittelRad?: boolean }>`
    display: grid;
    grid-template-areas: 'studietype periode studiebelastning utgifter beløp';
    grid-template-columns: 10rem 8rem 8rem 6rem 4rem;
    grid-gap: 1rem;
    margin-bottom: ${(props) => (props.erTittelRad ? '0.5rem' : '0')};
`;

const HøyrejustertNormaltekst = styled(Normaltekst)`
    text-align: right;
`;

const HøyrejusterElement = styled(Element)`
    text-align: right;
`;

export const UtregningstabellSkolepenger: React.FC<{
    beregningsresultat: Ressurs<IBeregningsperiodeSkolepenger[]>;
}> = ({ beregningsresultat }) => {
    return (
        <DataViewer response={{ beregningsresultat }}>
            {({ beregningsresultat }) => (
                <>
                    <Heading spacing size={'small'} level={'5'}>
                        Utregning
                    </Heading>
                    <Rad erTittelRad>
                        <Element>Studietype</Element>
                        <HøyrejusterElement>Periode</HøyrejusterElement>
                        <HøyrejusterElement>Studiebelastning</HøyrejusterElement>
                        <HøyrejusterElement>Utgifter</HøyrejusterElement>
                        <HøyrejusterElement>Utbetales</HøyrejusterElement>
                    </Rad>
                    {beregningsresultat.map((rad) => (
                        <Rad>
                            <Normaltekst>
                                {skolepengerStudietypeTilTekst[rad.beregningsgrunnlag.studietype]}
                            </Normaltekst>
                            <HøyrejustertNormaltekst>
                                {`${formaterNullableMånedÅr(
                                    rad.periode.fradato
                                )} - ${formaterNullableMånedÅr(rad.periode.tildato)}`}
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {`${rad.beregningsgrunnlag.studiebelastning} %`}
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {formaterTallMedTusenSkille(rad.beregningsgrunnlag.utgifter)} kr
                            </HøyrejustertNormaltekst>
                            <HøyrejustertNormaltekst>
                                {formaterTallMedTusenSkille(rad.beløp)} kr
                            </HøyrejustertNormaltekst>
                        </Rad>
                    ))}
                </>
            )}
        </DataViewer>
    );
};
