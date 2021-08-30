import { ISimulering } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    formaterIsoMånedÅr,
    formaterIsoMånedÅrFull,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../App/utils/formatter';
import navFarger from 'nav-frontend-core';

interface ISimuleringOversikt {
    simulering: ISimulering;
}

const BoksMedBorder = styled.div`
    display: inline-flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid;
    padding: 2rem;
`;

const RadTittel = styled.th`
    text-align: left;
`;

const Verdi = styled.td`
    text-align: right;
`;

const TotaltPeriode = styled.div`
    border-bottom: 1px solid #a0a0a0;
`;

const ResultatVerdi = styled(Normaltekst)<{ verdi: number }>`
    color: ${(props) => (props.verdi > 0 ? navFarger.navGronn : navFarger.redError)};
`;

const Tabell = styled.table``;

const NestePeriode: React.FC<{ resultat: number; fomDato: string }> = ({ resultat, fomDato }) => {
    return (
        <>
            <Element>Neste utbetaling</Element>
            <Tabell>
                <tr>
                    <RadTittel>
                        <Normaltekst>
                            {formaterStrengMedStorForbokstav(formaterIsoMånedÅrFull(fomDato))}
                        </Normaltekst>
                    </RadTittel>
                    <Verdi>
                        <ResultatVerdi verdi={resultat}>
                            <Element>{formaterTallMedTusenSkilleEllerStrek(resultat)} kr</Element>
                        </ResultatVerdi>
                    </Verdi>
                </tr>
            </Tabell>
        </>
    );
};
const SimuleringOversikt: React.FC<ISimuleringOversikt> = ({ simulering }) => {
    const { fomDatoNestePeriode, etterbetaling, feilutbetaling, fom, tomSisteUtbetaling } =
        simulering;

    const nestePeriode = simulering.perioder.find((p) => p.fom === fomDatoNestePeriode);
    return (
        <BoksMedBorder>
            <TotaltPeriode>
                <div>
                    <Element>
                        Totalt for periode {formaterIsoMånedÅr(fom)} til og med{' '}
                        {formaterIsoMånedÅr(tomSisteUtbetaling)}
                    </Element>
                </div>
                <Tabell>
                    <tr>
                        <RadTittel>
                            <Normaltekst>Feilutbetaling</Normaltekst>
                        </RadTittel>
                        <Verdi>
                            <Element>
                                {formaterTallMedTusenSkilleEllerStrek(feilutbetaling)} kr
                            </Element>
                        </Verdi>
                    </tr>
                    <tr>
                        <RadTittel>
                            <Normaltekst>Etterbetaling</Normaltekst>
                        </RadTittel>
                        <Verdi>
                            <Element>
                                {formaterTallMedTusenSkilleEllerStrek(etterbetaling)} kr
                            </Element>
                        </Verdi>
                    </tr>
                </Tabell>
            </TotaltPeriode>
            <>
                {nestePeriode && (
                    <NestePeriode resultat={nestePeriode.resultat} fomDato={nestePeriode.fom} />
                )}
            </>
        </BoksMedBorder>
    );
};

export default SimuleringOversikt;
