import { formaterIsoMånedÅrFull, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import {
    ESkolepengerStudietype,
    ISkoleårsperiodeSkolepenger,
    IVedtakForSkolepenger,
    skolepengerStudietypeTilTekst,
    SkolepengerUtgift,
} from '../../../App/typer/vedtak';
import React from 'react';
import {
    beregnSkoleår,
    formatterSkoleår,
} from '../../Behandling/VedtakOgBeregning/Skolepenger/skoleår';
import { Table } from '@navikt/ds-react';

const lagSkoleår = (periode: ISkoleårsperiodeSkolepenger): string => {
    if (periode.perioder.length === 0) {
        return '';
    }
    const beregnetSkoleår = beregnSkoleår(
        periode.perioder[0].årMånedFra,
        periode.perioder[periode.perioder.length - 1].årMånedTil
    );
    return beregnetSkoleår.gyldig ? formatterSkoleår(beregnetSkoleår) : '';
};

const lagStudietype = (periode: ISkoleårsperiodeSkolepenger) =>
    periode.perioder.length > 0 ? periode.perioder[0].studietype : undefined;

const rad = (
    utgift: SkolepengerUtgift,
    skoleår: string,
    studietype: ESkolepengerStudietype | undefined
) => {
    return (
        <Table.Row key={utgift.id}>
            <Table.DataCell>{skoleår}</Table.DataCell>
            <Table.DataCell>
                {studietype && skolepengerStudietypeTilTekst[studietype]}
            </Table.DataCell>
            <Table.DataCell>{formaterIsoMånedÅrFull(utgift.årMånedFra)}</Table.DataCell>
            <Table.DataCell>{formaterTallMedTusenSkille(utgift.stønad)}</Table.DataCell>
        </Table.Row>
    );
};

const VedtaksperioderSkolepenger: React.FC<{ vedtak: IVedtakForSkolepenger }> = ({ vedtak }) => {
    return (
        <Table zebraStripes={true} style={{ width: '800px' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Skoleår</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Studietype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utbetalingsmåned</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Stønadsbeløp</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.skoleårsperioder.map((periode) => {
                    const formattertSkoleår = lagSkoleår(periode);
                    const studietype = lagStudietype(periode);
                    return periode.utgiftsperioder.map((utgift) =>
                        rad(utgift, formattertSkoleår, studietype)
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default VedtaksperioderSkolepenger;
