import React from 'react';
import {
    formaterIsoMånedÅrFull,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import { RadTittel, RadVerdi, ResultatVerdi, SimuleringOversiktTabell } from './SimuleringOversikt';
import { ISimuleringPeriode } from './SimuleringTyper';
import { BodyShortSmall, LabelSmallAsText } from '../../../Felles/Visningskomponenter/Tekster';

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
            <LabelSmallAsText>Neste utbetaling</LabelSmallAsText>
            <SimuleringOversiktTabell>
                <tbody>
                    <tr>
                        <RadTittel>
                            <BodyShortSmall>
                                {formaterStrengMedStorForbokstav(formaterIsoMånedÅrFull(fomDato))}
                            </BodyShortSmall>
                        </RadTittel>
                        <RadVerdi>
                            <ResultatVerdi verdi={resultat}>
                                <LabelSmallAsText>
                                    {formaterTallMedTusenSkilleEllerStrek(resultat)} kr
                                </LabelSmallAsText>
                            </ResultatVerdi>
                        </RadVerdi>
                    </tr>
                </tbody>
            </SimuleringOversiktTabell>
        </>
    );
};
