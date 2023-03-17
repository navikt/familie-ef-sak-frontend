import React from 'react';
import { IBeregningSkolepengerResponse } from '../../../../App/typer/vedtak';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../App/utils/formatter';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    column-gap: 1rem;
    padding-left: 1rem;
`;

const HøyrejustertBodyShort = styled(BodyShortSmall)`
    text-align: right;
`;

export const UtregningstabellSkolepenger: React.FC<{
    beregningsresultat: Ressurs<IBeregningSkolepengerResponse>;
    className?: string;
}> = ({ beregningsresultat, className }) => {
    return (
        <DataViewer response={{ beregningsresultat }}>
            {({ beregningsresultat }) => (
                <div className={className}>
                    <Heading spacing size={'small'} level={'5'}>
                        Utregning
                    </Heading>
                    <Grid>
                        <SmallTextLabel>Fra</SmallTextLabel>
                        <SmallTextLabel>Utgifter</SmallTextLabel>
                        <SmallTextLabel>Stønadsbeløp</SmallTextLabel>
                        {beregningsresultat.perioder.map((periode) => {
                            return (
                                <>
                                    <BodyShortSmall>
                                        {formaterNullableMånedÅr(periode.årMånedFra)}
                                    </BodyShortSmall>
                                    <HøyrejustertBodyShort>
                                        {formaterTallMedTusenSkille(periode.utgifter)}
                                    </HøyrejustertBodyShort>
                                    <HøyrejustertBodyShort>
                                        {formaterTallMedTusenSkille(periode.beløp)}
                                    </HøyrejustertBodyShort>
                                </>
                            );
                        })}
                    </Grid>
                </div>
            )}
        </DataViewer>
    );
};
