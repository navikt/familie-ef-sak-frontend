import React from 'react';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import styled from 'styled-components';
import { RadTittel, RadVerdi, SimuleringOversiktTabell } from './SimuleringOversikt';
import { BodyShortSmall, LabelSmallAsText } from '../../../Felles/Visningskomponenter/Tekster';

const BoksMedBottomBorder = styled.div`
    border-bottom: 1px solid #a0a0a0;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
`;

export const TotaltForPeriode: React.FC<{
    fom: string;
    tomSisteUtbetaling: string;
    feilutbetaling: number;
    etterbetaling: number;
}> = ({ fom, tomSisteUtbetaling, feilutbetaling, etterbetaling }) => (
    <BoksMedBottomBorder>
        <div>
            <LabelSmallAsText>
                Totalt for periode {formaterNullableMånedÅr(fom)} til og med{' '}
                {formaterNullableMånedÅr(tomSisteUtbetaling)}
            </LabelSmallAsText>
        </div>
        <SimuleringOversiktTabell>
            <tbody>
                <tr>
                    <RadTittel>
                        <BodyShortSmall>Feilutbetaling</BodyShortSmall>
                    </RadTittel>
                    <RadVerdi>
                        <LabelSmallAsText>
                            {`-${formaterTallMedTusenSkilleEllerStrek(feilutbetaling)}`} kr
                        </LabelSmallAsText>
                    </RadVerdi>
                </tr>
                <tr>
                    <RadTittel>
                        <BodyShortSmall>Etterbetaling</BodyShortSmall>
                    </RadTittel>
                    <RadVerdi>
                        <LabelSmallAsText>
                            {formaterTallMedTusenSkilleEllerStrek(etterbetaling)} kr
                        </LabelSmallAsText>
                    </RadVerdi>
                </tr>
            </tbody>
        </SimuleringOversiktTabell>
    </BoksMedBottomBorder>
);
