import { formaterIsoMånedÅrFull, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import {
    ESkolepengerStudietype,
    ISkoleårsperiodeSkolepenger,
    IVedtakForSkolepenger,
    skolepengerStudietypeTilTekst,
    SkolepengerUtgift,
} from '../../../App/typer/vedtak';
import React, { FC } from 'react';
import {
    beregnSkoleår,
    formatterSkoleår,
} from '../../Behandling/VedtakOgBeregning/Skolepenger/Felles/skoleår';
import { Table } from '@navikt/ds-react';
import { TableDataCellSmall, TableHeaderCellSmall } from './vedtakshistorikkUtil';

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

const Rad: FC<{
    utgift: SkolepengerUtgift;
    skoleår: string;
    studietype: ESkolepengerStudietype | undefined;
}> = ({ utgift, skoleår, studietype }) => {
    return (
        <Table.Row key={utgift.id}>
            <TableDataCellSmall>{skoleår}</TableDataCellSmall>
            <TableDataCellSmall>
                {studietype && skolepengerStudietypeTilTekst[studietype]}
            </TableDataCellSmall>
            <TableDataCellSmall>{formaterIsoMånedÅrFull(utgift.årMånedFra)}</TableDataCellSmall>
            <TableDataCellSmall>{formaterTallMedTusenSkille(utgift.stønad)}</TableDataCellSmall>
        </Table.Row>
    );
};

const VedtaksperioderSkolepenger: FC<{ vedtak: IVedtakForSkolepenger }> = ({ vedtak }) => {
    return (
        <Table size="small" style={{ marginBottom: '1rem' }}>
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall scope="col">Skoleår</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Studietype</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Utbetalingsmåned</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Stønadsbeløp</TableHeaderCellSmall>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.skoleårsperioder.map((periode) => {
                    const formattertSkoleår = lagSkoleår(periode);
                    const studietype = lagStudietype(periode);
                    return periode.utgiftsperioder.map((utgift, index) => (
                        <Rad
                            key={index}
                            utgift={utgift}
                            skoleår={formattertSkoleår}
                            studietype={studietype}
                        />
                    ));
                })}
            </Table.Body>
        </Table>
    );
};

export default VedtaksperioderSkolepenger;
