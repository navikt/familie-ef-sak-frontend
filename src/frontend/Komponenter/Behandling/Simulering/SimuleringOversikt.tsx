import { SimuleringResultat } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { TotaltForPeriode } from './TotaltForPeriode';
import { NestePeriode } from './NestePeriode';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { AGreen500, ARed500 } from '@navikt/ds-tokens/dist/tokens';

interface ISimuleringOversikt {
    simulering: SimuleringResultat;
}

const BoksMedBorder = styled.div`
    display: inline-flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid;
    padding: 2rem;
`;

export const RadTittel = styled.th`
    text-align: left;
`;

export const RadVerdi = styled.td`
    text-align: right;
`;

export const ResultatVerdi = styled(BodyShortSmall)<{ $verdi: number }>`
    color: ${(props) => (props.$verdi > 0 ? AGreen500 : ARed500)};
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
            <Heading size={'medium'} level={'2'}>
                Simulering
            </Heading>
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
