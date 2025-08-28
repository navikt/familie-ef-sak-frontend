import { IDeltBostedPeriode } from '../../App/typer/personopplysninger';
import { BodyShort, Popover, Table, Tag } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import React from 'react';

function utledHistoriskStyle(deltBostedPeriode: IDeltBostedPeriode) {
    return deltBostedPeriode.historisk ? 'subtle' : 'default';
}

const utledHistoriskTag = (historisk: boolean) =>
    historisk ? (
        ''
    ) : (
        <Tag variant="success" size="small">
            Gjeldende
        </Tag>
    );

const deltBostedPeriodeKey = (deltBostedPeriode: IDeltBostedPeriode) =>
    `${deltBostedPeriode.startdatoForKontrakt}-${deltBostedPeriode.sluttdatoForKontrakt}`;

export const popoverContentDeltBosted = (deltBostedPerioder: IDeltBostedPeriode[]) => (
    <Popover.Content>
        <BodyShort>Delt bosted:</BodyShort>
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {deltBostedPerioder.map((deltBostedPeriode) => {
                    const histStyle = utledHistoriskStyle(deltBostedPeriode);
                    return (
                        <Table.Row key={deltBostedPeriodeKey(deltBostedPeriode)}>
                            <Table.DataCell>
                                <BodyShort textColor={histStyle}>
                                    {formaterNullableIsoDato(
                                        deltBostedPeriode.startdatoForKontrakt
                                    )}
                                </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort textColor={histStyle}>
                                    {formaterNullableIsoDato(
                                        deltBostedPeriode.sluttdatoForKontrakt
                                    )}
                                </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort textColor={histStyle}>
                                    {utledHistoriskTag(deltBostedPeriode.historisk)}
                                </BodyShort>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    </Popover.Content>
);
