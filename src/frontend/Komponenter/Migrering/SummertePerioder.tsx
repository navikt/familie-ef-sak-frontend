import React from 'react';
import { SummertPeriode } from '../../App/typer/infotrygd';
import { formaterNullableMånedÅr, formaterTallMedTusenSkille } from '../../App/utils/formatter';
import { Stønadstype } from '../../App/typer/behandlingstema';
import { Table } from '@navikt/ds-react';

const formatFomTom = (periode: SummertPeriode) => (
    <>
        {formaterNullableMånedÅr(periode.stønadFom)}
        {' - '}
        {formaterNullableMånedÅr(periode.stønadTom)}
    </>
);

const utledTabellHeaderOvergangsstønad = () => {
    return (
        <Table.Row>
            <Table.HeaderCell scope={'col'}>Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Inntektsgrunnlag</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Inntektsreduksjon</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Samordningsfradrag</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Månedsbeløp</Table.HeaderCell>
        </Table.Row>
    );
};

const utledTabellHeaderBarnetilsyn = () => {
    return (
        <Table.Row>
            <Table.HeaderCell scope={'col'}>Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Utgifter barnetilsyn</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Månedsbeløp</Table.HeaderCell>
        </Table.Row>
    );
};

const utledTabellHeaderSkolepenger = () => {
    return (
        <Table.Row>
            <Table.HeaderCell scope={'col'}>Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Månedsbeløp</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Engangsbeløp</Table.HeaderCell>
        </Table.Row>
    );
};

const SummertePerioderOvergangsstønad: React.FC<{ perioder: SummertPeriode[] }> = ({
    perioder,
}) => {
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeaderOvergangsstønad()}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={periode.stønadFom}>
                        <Table.DataCell>{formatFomTom(periode)}</Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.inntektsgrunnlag)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.inntektsreduksjon)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.samordningsfradrag)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.månedsbeløp)}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const SummertePerioderBarnetilsyn: React.FC<{ perioder: SummertPeriode[] }> = ({ perioder }) => {
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeaderBarnetilsyn()}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={periode.stønadFom}>
                        <Table.DataCell>{formatFomTom(periode)}</Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.månedsbeløp)}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const SummertePerioderSkolepenger: React.FC<{ perioder: SummertPeriode[] }> = ({ perioder }) => {
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeaderSkolepenger()}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={periode.stønadFom}>
                        <Table.DataCell>{formatFomTom(periode)}</Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.månedsbeløp)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.engangsbeløp)}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
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
