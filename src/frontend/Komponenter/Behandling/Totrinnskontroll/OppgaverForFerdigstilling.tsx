import { Heading, Table, Checkbox, BodyLong } from '@navikt/ds-react';
import React, { FC } from 'react';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';
import styled from 'styled-components';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';

const StyledTableDataCell = styled(Table.DataCell)`
    padding: 12px 8px 12px 0;
`;

const StyledBodyLong = styled(BodyLong)`
    white-space: break-spaces;
`;

const TableContainer = styled.div`
    padding: 0.5rem;
    background-color: ${ALimegreen100};
`;

export const OppgaverForFerdigstilling: FC<{
    fremleggsOppgaver: IOppgaverResponse;
    fremleggsoppgaveIderSomSkalFerdigstilles: number[];
}> = ({ fremleggsOppgaver, fremleggsoppgaveIderSomSkalFerdigstilles }) => {
    const fremleggsOppgaverSomSkalFerdigstilles = fremleggsOppgaver?.oppgaver?.filter(({ id }) =>
        fremleggsoppgaveIderSomSkalFerdigstilles?.includes(id)
    );

    if (!fremleggsOppgaver || fremleggsoppgaveIderSomSkalFerdigstilles.length === 0) {
        return;
    }

    return (
        <>
            <Heading size="small">
                Følgende fremleggsoppgaver ferdigstilles ved godkjenning av dette vedtaket:
            </Heading>
            <TableContainer>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell scope="col">Oppgavetype</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Gjelder</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Frist</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {fremleggsOppgaverSomSkalFerdigstilles.map(
                            (
                                {
                                    id,
                                    oppgavetype,
                                    behandlingstema,
                                    tilordnetRessurs,
                                    beskrivelse,
                                    fristFerdigstillelse,
                                },
                                i
                            ) => {
                                return (
                                    <Table.ExpandableRow
                                        key={i}
                                        content={<StyledBodyLong>{beskrivelse}</StyledBodyLong>}
                                        togglePlacement="right"
                                        expandOnRowClick
                                    >
                                        <StyledTableDataCell>
                                            <Checkbox
                                                hideLabel
                                                checked={fremleggsoppgaveIderSomSkalFerdigstilles.includes(
                                                    id
                                                )}
                                                aria-labelledby={`id-${id}`}
                                                readOnly
                                            >
                                                {' '}
                                            </Checkbox>
                                        </StyledTableDataCell>
                                        <Table.DataCell scope="row">
                                            {oppgavetype && oppgaveTypeTilTekst[oppgavetype]}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {behandlingstema &&
                                                behandlingstemaTilTekst[behandlingstema]}
                                            {/* {behandlingstype &&
                                            behandlingstypeTilTekst[behandlingstype]} */}
                                        </Table.DataCell>
                                        <Table.DataCell>{tilordnetRessurs ?? '-'}</Table.DataCell>
                                        <Table.DataCell>
                                            {fristFerdigstillelse &&
                                                formaterIsoDato(fristFerdigstillelse)}
                                        </Table.DataCell>
                                    </Table.ExpandableRow>
                                );
                            }
                        )}
                    </Table.Body>
                </Table>
            </TableContainer>
        </>
    );
};
