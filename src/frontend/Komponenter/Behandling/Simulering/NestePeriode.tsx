import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    formaterIsoMånedÅrFull,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import { RadTittel, RadVerdi, ResultatVerdi, SimuleringOversiktTabell } from './SimuleringOversikt';
import { ISimuleringPeriode } from './SimuleringTyper';

export const NestePeriode: React.FC<{ nestePeriode: ISimuleringPeriode | undefined }> = ({
    nestePeriode,
}) => {
    if (!nestePeriode) {
        return null;
    }
    const { resultat } = nestePeriode;
    const fomDato = nestePeriode.fom;

    return (
        <>
            <Element>Neste utbetaling</Element>
            <SimuleringOversiktTabell>
                <tr>
                    <RadTittel>
                        <Normaltekst>
                            {formaterStrengMedStorForbokstav(formaterIsoMånedÅrFull(fomDato))}
                        </Normaltekst>
                    </RadTittel>
                    <RadVerdi>
                        <ResultatVerdi verdi={resultat}>
                            <Element>{formaterTallMedTusenSkilleEllerStrek(resultat)} kr</Element>
                        </ResultatVerdi>
                    </RadVerdi>
                </tr>
            </SimuleringOversiktTabell>
        </>
    );
};
