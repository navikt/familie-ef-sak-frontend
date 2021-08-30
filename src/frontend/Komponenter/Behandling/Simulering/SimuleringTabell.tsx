import { ISimuleringTabell } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../App/utils/formatter';

const Tabell = styled.table`
    border-collapse: collapse;
`;

const ÅrHeader = styled.th`
    padding: 0.75rem;
    border-bottom: 1px solid ${navFarger.navGra80};
`;

const BasisKolonne = styled.td`
    padding: 0.75rem;
    border-bottom: 1px solid ${navFarger.navGra20};
`;

const VerdiKolonne = styled(BasisKolonne)<{ gjelderNestePeriode: boolean }>`
    text-align: right;
    border-left: ${(props) => props.gjelderNestePeriode && `1px dashed ${navFarger.navGra60}`};
`;

const MånedHeader = styled(VerdiKolonne)<{ gjelderNestePeriode: boolean }>`
    border-bottom: 1px solid ${navFarger.navGra80};
`;

const ResultatVerdi = styled(Normaltekst)<{ verdi: number }>`
    color: ${(props) => (props.verdi > 0 ? navFarger.navGronn : navFarger.redError)};
`;

const SimuleringTabell: React.FC<ISimuleringTabell> = (simuleringstabell) => {
    const { perioder, årsvelger } = simuleringstabell;
    return (
        <Tabell>
            <thead>
                <tr>
                    <ÅrHeader>
                        <Undertittel>{årsvelger.valgtÅr}</Undertittel>
                    </ÅrHeader>
                    {perioder.map((p) => {
                        return (
                            <MånedHeader key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <Element>{p.måned}</Element>
                            </MånedHeader>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <BasisKolonne>
                        <Element>Nytt beløp</Element>
                    </BasisKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <Normaltekst>
                                    {formaterTallMedTusenSkilleEllerStrek(p.nyttBeløp)}
                                </Normaltekst>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
                <tr>
                    <BasisKolonne>
                        <Element>Tidligere utbetalt</Element>
                    </BasisKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <Normaltekst>
                                    {formaterTallMedTusenSkilleEllerStrek(p.tidligereUtbetalt)}
                                </Normaltekst>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
                <tr>
                    <BasisKolonne>
                        <Element>Resultat</Element>
                    </BasisKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <ResultatVerdi verdi={p.resultat}>
                                    {formaterTallMedTusenSkilleEllerStrek(p.resultat)}
                                </ResultatVerdi>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
            </tbody>
        </Tabell>
    );
};

export default SimuleringTabell;
