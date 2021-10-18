import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import styled from 'styled-components';
import { RadTittel, RadVerdi, SimuleringOversiktTabell } from './SimuleringOversikt';

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
            <Element>
                Totalt for periode {formaterNullableMånedÅr(fom)} til og med{' '}
                {formaterNullableMånedÅr(tomSisteUtbetaling)}
            </Element>
        </div>
        <SimuleringOversiktTabell>
            <tbody>
                <tr>
                    <RadTittel>
                        <Normaltekst>Feilutbetaling</Normaltekst>
                    </RadTittel>
                    <RadVerdi>
                        <Element>
                            {`-${formaterTallMedTusenSkilleEllerStrek(feilutbetaling)}`} kr
                        </Element>
                    </RadVerdi>
                </tr>
                <tr>
                    <RadTittel>
                        <Normaltekst>Etterbetaling</Normaltekst>
                    </RadTittel>
                    <RadVerdi>
                        <Element>{formaterTallMedTusenSkilleEllerStrek(etterbetaling)} kr</Element>
                    </RadVerdi>
                </tr>
            </tbody>
        </SimuleringOversiktTabell>
    </BoksMedBottomBorder>
);
