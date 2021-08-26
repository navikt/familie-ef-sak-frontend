import React, { useState } from 'react';
import { ISimulering } from './SimuleringTyper';
import SimuleringTabell from './SimuleringTabell';
import {
    formaterIsoMåned,
    formaterIsoÅr,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import { gjelderÅr } from '../../../App/utils/dato';

const SimuleringTabellWrapper: React.FC<{ simuleringsresultat: ISimulering }> = ({
    simuleringsresultat,
}) => {
    const muligeÅr = [...new Set(simuleringsresultat.perioder.map((p) => formaterIsoÅr(p.fom)))];

    const [år, settÅr] = useState(Math.max(...muligeÅr));

    const simuleringsperioder = simuleringsresultat.perioder
        .filter((p) => {
            return gjelderÅr(p.fom, år);
        })
        .map((p) => {
            return {
                måned: formaterIsoMåned(p.fom),
                nyttBeløp: formaterTallMedTusenSkilleEllerStrek(p.nyttBeløp),
                tidligereUtbetalt: formaterTallMedTusenSkilleEllerStrek(p.tidligereUtbetalt),
                resultat: formaterTallMedTusenSkilleEllerStrek(p.resultat),
                erFremtidigVerdi: false,
            };
        }); // Legg inn tomme perioder
    return (
        <SimuleringTabell
            perioder={simuleringsperioder}
            årsvelger={{ valgtÅr: 2021, settÅr: settÅr, muligeÅr: muligeÅr }}
        />
    );
};

export default SimuleringTabellWrapper;
