import { ISimulering } from './SimuleringTyper';
import React from 'react';
import {
    formaterIsoMånedÅr,
    formaterIsoMånedÅrFull,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';

interface ISimuleringOversikt {
    simulering: ISimulering;
}

const NestePeriode: React.FC<{ resultat: number; fomDato: string }> = ({ resultat, fomDato }) => {
    return (
        <div>
            <div>Neste utbetaling</div>
            <div>{formaterIsoMånedÅrFull(fomDato)}</div>
            <div>{formaterTallMedTusenSkilleEllerStrek(resultat)}</div>
        </div>
    );
};
const SimuleringOversikt: React.FC<ISimuleringOversikt> = ({ simulering }) => {
    const { fomDatoNestePeriode, etterbetaling, feilutbetaling, fom, tomSisteUtbetaling } =
        simulering;

    const nestePeriode = simulering.perioder.find((p) => p.fom === fomDatoNestePeriode);
    return (
        <>
            <div>
                Totalt for periode {formaterIsoMånedÅr(fom)} til og med{' '}
                {formaterIsoMånedÅr(tomSisteUtbetaling)}
            </div>
            <div>Feilutbetaling: {feilutbetaling}</div>
            <div>Etterbetaling: {etterbetaling}</div>
            <>
                {nestePeriode && (
                    <NestePeriode resultat={nestePeriode.resultat} fomDato={nestePeriode.fom} />
                )}
            </>
        </>
    );
};

export default SimuleringOversikt;
