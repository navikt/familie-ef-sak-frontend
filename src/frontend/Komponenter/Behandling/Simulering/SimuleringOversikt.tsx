import { ISimulering } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { TotaltForPeriode } from './TotaltForPeriode';
import { NestePeriode } from './NestePeriode';

interface ISimuleringOversikt {
    simulering: ISimulering;
}

const BoksMedBorder = styled.div`
    display: inline-flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid;
    padding: 2rem;
    margin: 2rem 0 2rem 0;
`;

export const RadTittel = styled.th`
    text-align: left;
`;

export const RadVerdi = styled.td`
    text-align: right;
`;

export const ResultatVerdi = styled(Normaltekst)<{ verdi: number }>`
    color: ${(props) => (props.verdi > 0 ? navFarger.navGronn : navFarger.redError)};
`;

export const SimuleringOversiktTabell = styled.table`
    width: 100%;
`;

const SimuleringOversikt: React.FC<ISimuleringOversikt> = ({ simulering }) => {
    const { fomDatoNestePeriode, fom, tomSisteUtbetaling, feilutbetaling, etterbetaling } =
        simulering;

    const nestePeriode = simulering.perioder.find((p) => p.fom === fomDatoNestePeriode);
    return (
        <>
            <Systemtittel>Simulering</Systemtittel>
            <BoksMedBorder>
                <TotaltForPeriode
                    fom={fom}
                    tomSisteUtbetaling={tomSisteUtbetaling}
                    feilutbetaling={feilutbetaling}
                    etterbetaling={etterbetaling}
                />
                <NestePeriode nestePeriode={nestePeriode} />
            </BoksMedBorder>
        </>
    );
};

export default SimuleringOversikt;
