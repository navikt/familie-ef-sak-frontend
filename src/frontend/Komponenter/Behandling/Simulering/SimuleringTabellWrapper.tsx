import React, { useState } from 'react';
import { ISimulering, ISimuleringTabellRad } from './SimuleringTyper';
import SimuleringTabell from './SimuleringTabell';
import { formaterIsoMåned, formaterIsoÅr } from '../../../App/utils/formatter';
import { gjelderÅr } from '../../../App/utils/dato';
import styled from 'styled-components';

const SimuleringsContainer = styled.div`
    margin: 1rem;
`;

const mapSimuleringstabellRader = (
    simuleringsresultat: ISimulering,
    år: number
): ISimuleringTabellRad[] => {
    return simuleringsresultat.perioder
        .filter((p) => {
            return gjelderÅr(p.fom, år);
        })
        .map((p) => {
            return {
                måned: formaterIsoMåned(p.fom),
                nyttBeløp: p.nyttBeløp,
                tidligereUtbetalt: p.tidligereUtbetalt,
                resultat: p.resultat,
                gjelderNestePeriode: p.fom === simuleringsresultat.fomDatoNestePeriode,
            };
        });
};

const SimuleringTabellWrapper: React.FC<{ simuleringsresultat: ISimulering }> = ({
    simuleringsresultat,
}) => {
    const muligeÅr = [...new Set(simuleringsresultat.perioder.map((p) => formaterIsoÅr(p.fom)))];

    const [år, settÅr] = useState(Math.max(...muligeÅr));

    const simuleringTabellRader = mapSimuleringstabellRader(simuleringsresultat, år);

    return (
        <SimuleringsContainer>
            <SimuleringTabell
                perioder={simuleringTabellRader}
                årsvelger={{ valgtÅr: år, settÅr: settÅr, muligeÅr: muligeÅr }}
            />
        </SimuleringsContainer>
    );
};

export default SimuleringTabellWrapper;
