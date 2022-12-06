import { ISimuleringTabell } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../App/utils/formatter';
import SimuleringÅrvelger from './SimuleringÅrvelger';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import {
    NavdsGlobalColorGreen500,
    NavdsGlobalColorRed500,
    NavdsSemanticColorBorder,
    NavdsSemanticColorBorderMuted,
} from '@navikt/ds-tokens/dist/tokens';

const Tabell = styled.table`
    border-collapse: collapse;
`;

const ÅrHeader = styled.th`
    padding: 0.75rem;
    border-bottom: 1px solid ${NavdsSemanticColorBorder};
`;

const BasisKolonne = styled.td`
    padding: 0.75rem;
    border-bottom: 1px solid ${NavdsSemanticColorBorderMuted};
`;

const VerdiKolonne = styled(BasisKolonne)<{ gjelderNestePeriode: boolean }>`
    text-align: right;
    border-left: ${(props) =>
        props.gjelderNestePeriode && `1px dashed ${NavdsSemanticColorBorder}`};
`;

const MånedHeader = styled(VerdiKolonne)<{ gjelderNestePeriode: boolean }>`
    border-bottom: 1px solid ${NavdsSemanticColorBorder};
`;

const ResultatVerdi = styled(BodyShortSmall)<{ verdi: number }>`
    color: ${(props) => (props.verdi > 0 ? NavdsGlobalColorGreen500 : NavdsGlobalColorRed500)};
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
                                <SmallTextLabel>{p.måned}</SmallTextLabel>
                            </MånedHeader>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <BasisKolonne>
                        <SmallTextLabel>Nytt beløp</SmallTextLabel>
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
                        <SmallTextLabel>Tidligere utbetalt</SmallTextLabel>
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
                        <SmallTextLabel>Resultat</SmallTextLabel>
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
