import React from 'react';
import {
    formaterIsoMånedÅrFull,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import { RadTittel, RadVerdi, ResultatVerdi, SimuleringOversiktTabell } from './SimuleringOversikt';
import { ISimuleringPeriode } from './SimuleringTyper';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';

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
            <SmallTextLabel>Neste utbetaling</SmallTextLabel>
            <SimuleringOversiktTabell>
                <tbody>
                    <tr>
                        <RadTittel>
                            <BodyShortSmall>
                                {formaterStrengMedStorForbokstav(formaterIsoMånedÅrFull(fomDato))}
                            </BodyShortSmall>
                        </RadTittel>
                        <RadVerdi>
                            <ResultatVerdi $verdi={resultat}>
                                <SmallTextLabel>
                                    {formaterTallMedTusenSkilleEllerStrek(resultat)} kr
                                </SmallTextLabel>
                            </ResultatVerdi>
                        </RadVerdi>
                    </tr>
                </tbody>
            </SimuleringOversiktTabell>
        </>
    );
};
