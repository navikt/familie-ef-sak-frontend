import React from 'react';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import styled from 'styled-components';
import { RadTittel, RadVerdi, SimuleringOversiktTabell } from './SimuleringOversikt';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';

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
            <SmallTextLabel>
                Totalt for periode {formaterNullableMånedÅr(fom)} til og med{' '}
                {formaterNullableMånedÅr(tomSisteUtbetaling)}
            </SmallTextLabel>
        </div>
        <SimuleringOversiktTabell>
            <tbody>
                <tr>
                    <RadTittel>
                        <BodyShortSmall>Feilutbetaling</BodyShortSmall>
                    </RadTittel>
                    <RadVerdi>
                        <SmallTextLabel>
                            {`-${formaterTallMedTusenSkilleEllerStrek(feilutbetaling)}`} kr
                        </SmallTextLabel>
                    </RadVerdi>
                </tr>
                <tr>
                    <RadTittel>
                        <BodyShortSmall>Etterbetaling</BodyShortSmall>
                    </RadTittel>
                    <RadVerdi>
                        <SmallTextLabel>
                            {formaterTallMedTusenSkilleEllerStrek(etterbetaling)} kr
                        </SmallTextLabel>
                    </RadVerdi>
                </tr>
            </tbody>
        </SimuleringOversiktTabell>
    </BoksMedBottomBorder>
);
