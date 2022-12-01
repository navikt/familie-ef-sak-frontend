import { ISimuleringTabell } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../App/utils/formatter';
import SimuleringÅrvelger from './SimuleringÅrvelger';
import { BodyShortSmall, LabelSmallAsText } from '../../../Felles/Visningskomponenter/Tekster';

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

const ResultatVerdi = styled(BodyShortSmall)<{ verdi: number }>`
    color: ${(props) => (props.verdi > 0 ? navFarger.navGronn : navFarger.redError)};
`;

const SimuleringTabell: React.FC<ISimuleringTabell> = (simuleringstabell) => {
    const { perioder, årsvelger } = simuleringstabell;
    return (
        <Tabell>
            <thead>
                <tr>
                    <ÅrHeader>
                        <SimuleringÅrvelger årsvelger={årsvelger} />
                    </ÅrHeader>
                    {perioder.map((p) => {
                        return (
                            <MånedHeader key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <LabelSmallAsText>{p.måned}</LabelSmallAsText>
                            </MånedHeader>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <BasisKolonne>
                        <LabelSmallAsText>Nytt beløp</LabelSmallAsText>
                    </BasisKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <BodyShortSmall>
                                    {formaterTallMedTusenSkilleEllerStrek(p.nyttBeløp)}
                                </BodyShortSmall>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
                <tr>
                    <BasisKolonne>
                        <LabelSmallAsText>Tidligere utbetalt</LabelSmallAsText>
                    </BasisKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned} gjelderNestePeriode={p.gjelderNestePeriode}>
                                <BodyShortSmall>
                                    {formaterTallMedTusenSkilleEllerStrek(p.tidligereUtbetalt)}
                                </BodyShortSmall>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
                <tr>
                    <BasisKolonne>
                        <LabelSmallAsText>Resultat</LabelSmallAsText>
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
