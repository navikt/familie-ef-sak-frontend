import React from 'react';
import { IBeregningSkolepengerResponse } from '../../../../App/typer/vedtak';
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
    grid-template-areas: 'dato utgifter beløp';
    grid-template-columns: 6rem 4rem 4rem;
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
    beregningsresultat: Ressurs<IBeregningSkolepengerResponse>;
    skjulVisning: boolean;
}> = ({ beregningsresultat, skjulVisning }) => {
    if (skjulVisning) {
        return null;
    }
    return (
        <DataViewer response={{ beregningsresultat }}>
            {({ beregningsresultat }) => (
                <>
                    <Heading spacing size={'small'} level={'5'}>
                        Utregning
                    </Heading>
                    <Rad erTittelRad>
                        <Element>Fra</Element>
                        <HøyrejusterElement>Utgifter</HøyrejusterElement>
                        <HøyrejusterElement>Stønadsbeløp</HøyrejusterElement>
                    </Rad>
                    {beregningsresultat.perioder.map((periode) => {
                        return (
                            <Rad>
                                <Normaltekst>
                                    {formaterNullableMånedÅr(periode.årMånedFra)}
                                </Normaltekst>
                                <HøyrejustertNormaltekst>
                                    {formaterTallMedTusenSkille(periode.utgifter)} kr
                                </HøyrejustertNormaltekst>
                                <HøyrejustertNormaltekst>
                                    {formaterTallMedTusenSkille(periode.beløp)} kr
                                </HøyrejustertNormaltekst>
                            </Rad>
                        );
                    })}
                </>
            )}
        </DataViewer>
    );
};
