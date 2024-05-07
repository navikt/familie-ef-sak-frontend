import { SimuleringTabellRad, SimuleringÅrsvelger } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../App/utils/formatter';
import ÅrVelger from './ÅrVelger';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { AGreen500, ARed500, ABorderStrong, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

const Tabell = styled.table`
    border-collapse: collapse;
`;

const TabellHeader = styled.th`
    border-bottom: 1px solid ${ABorderStrong};
`;

const BasisKolonne = styled.td`
    padding: 0.75rem;
    border-bottom: 1px solid ${ABorderDefault};
`;

const VerdiKolonne = styled(BasisKolonne)<{ $gjelderNestePeriode: boolean }>`
    text-align: right;
    border-left: ${(props) => props.$gjelderNestePeriode && `1px dashed ${ABorderStrong}`};
`;

const MånedHeader = styled(VerdiKolonne)<{ $gjelderNestePeriode: boolean }>`
    border-bottom: 1px solid ${ABorderStrong};
`;

const ResultatVerdi = styled(BodyShortSmall)<{ $verdi: number }>`
    color: ${(props) => (props.$verdi > 0 ? AGreen500 : ARed500)};
`;

const ÅrVelgerMargin = styled(ÅrVelger)`
    margin: 0.25rem 0 0.25rem 0;
`;

interface Props {
    perioder: SimuleringTabellRad[];
    årsvelger: SimuleringÅrsvelger;
}

const SimuleringTabell: React.FC<Props> = (simuleringstabell) => {
    const { perioder, årsvelger } = simuleringstabell;
    return (
        <Tabell>
            <thead>
                <tr>
                    <TabellHeader>
                        <ÅrVelgerMargin årsvelger={årsvelger} />
                    </TabellHeader>
                    {perioder.map((p) => {
                        return (
                            <MånedHeader key={p.måned} $gjelderNestePeriode={p.gjelderNestePeriode}>
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
                            <VerdiKolonne
                                key={p.måned}
                                $gjelderNestePeriode={p.gjelderNestePeriode}
                            >
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
                            <VerdiKolonne
                                key={p.måned}
                                $gjelderNestePeriode={p.gjelderNestePeriode}
                            >
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
                            <VerdiKolonne
                                key={p.måned}
                                $gjelderNestePeriode={p.gjelderNestePeriode}
                            >
                                <ResultatVerdi $verdi={p.resultat}>
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
