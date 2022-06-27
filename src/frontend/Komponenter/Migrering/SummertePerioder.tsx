import React from 'react';
import { SummertPeriode } from '../../App/typer/infotrygd';
import { formaterNullableMånedÅr, formaterTallMedTusenSkille } from '../../App/utils/formatter';
import { Stønadstype } from '../../App/typer/behandlingstema';
import styled from 'styled-components';

const StyledTabell = styled.table``;

const Rad = styled.tr``;

const formatFomTom = (periode: SummertPeriode) => (
    <>
        {formaterNullableMånedÅr(periode.stønadFom)}
        {' - '}
        {formaterNullableMånedÅr(periode.stønadTom)}
    </>
);

const SummertePerioderOvergangsstønad: React.FC<{ perioder: SummertPeriode[] }> = ({
    perioder,
}) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Inntektsreduksjon</th>
                    <th>Samordningsfradrag</th>
                    <th>Månedsbeløp</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={periode.stønadFom}>
                        <td>{formatFomTom(periode)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsreduksjon)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const SummertePerioderBarnetilsyn: React.FC<{ perioder: SummertPeriode[] }> = ({ perioder }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Utgifter barnetilsyn</th>
                    <th>Månedsbeløp</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={periode.stønadFom}>
                        <td>{formatFomTom(periode)}</td>
                        <td>{formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}</td>
                        <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const SummertePerioderSkolepenger: React.FC<{ perioder: SummertPeriode[] }> = ({ perioder }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Månedsbeløp</th>
                    <th>Engangsbeløp</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={periode.stønadFom}>
                        <td>{formatFomTom(periode)}</td>
                        <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
                        <td>{formaterTallMedTusenSkille(periode.engangsbeløp)}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const SummertePerioder: React.FC<{ stønadstype: Stønadstype; perioder: SummertPeriode[] }> = ({
    stønadstype,
    perioder,
}) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return <SummertePerioderOvergangsstønad perioder={perioder} />;
        case Stønadstype.BARNETILSYN:
            return <SummertePerioderBarnetilsyn perioder={perioder} />;
        case Stønadstype.SKOLEPENGER:
            return <SummertePerioderSkolepenger perioder={perioder} />;
    }
};

export default SummertePerioder;
