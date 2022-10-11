import React, { FC } from 'react';
import { IUtestengelse } from '../../App/typer/utestengelse';
import { Heading, Table } from '@navikt/ds-react';
import { formaterIsoDato } from '../../App/utils/formatter';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    width: 18rem;
`;

const StyledUtestengelse = styled.div`
    margin-top: 1.5rem;
`;

const Utestengelse: FC<{ utestengelser: IUtestengelse[] }> = ({ utestengelser }) => {
    if (!utestengelser.length) {
        return null;
    }
    return (
        <StyledUtestengelse>
            <Heading level="3" size="medium">
                Utestengelser
            </Heading>
            <StyledTable>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Fra</Table.ColumnHeader>
                        <Table.ColumnHeader>Til</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {utestengelser.map((utestengelse) => {
                        return (
                            <Table.Row key={utestengelse.id}>
                                <Table.DataCell>
                                    {formaterIsoDato(utestengelse.periode.fom)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterIsoDato(utestengelse.periode.tom)}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </StyledTable>
        </StyledUtestengelse>
    );
};

export default Utestengelse;
