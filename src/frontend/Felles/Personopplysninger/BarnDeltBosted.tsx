import { IDeltBostedPeriode } from '../../App/typer/personopplysninger';
import { BodyShort, Popover, Table, Tag } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import React from 'react';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

export const StyledDiv: React.FC<{ $historisk?: boolean; children?: React.ReactNode }> = ({
    $historisk,
    children,
}) => <div style={$historisk ? { color: ATextSubtle } : undefined}>{children}</div>;

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
                    <Table.HeaderCell scope="col">
                        <div style={{ marginLeft: '1rem;' }}>Til</div>
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {deltBostedPerioder.map((deltBostedPeriode) => {
                    return (
                        <Table.Row key={deltBostedPeriodeKey(deltBostedPeriode)}>
                            <Table.DataCell>
                                <StyledDiv $historisk={deltBostedPeriode.historisk}>
                                    {formaterNullableIsoDato(
                                        deltBostedPeriode.startdatoForKontrakt
                                    )}
                                </StyledDiv>
                            </Table.DataCell>
                            <Table.DataCell>
                                <StyledDiv $historisk={deltBostedPeriode.historisk}>
                                    {formaterNullableIsoDato(
                                        deltBostedPeriode.sluttdatoForKontrakt
                                    )}
                                </StyledDiv>
                            </Table.DataCell>
                            <Table.DataCell>
                                <StyledDiv $historisk={deltBostedPeriode.historisk}>
                                    {utledHistoriskTag(deltBostedPeriode.historisk)}
                                </StyledDiv>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    </Popover.Content>
);
