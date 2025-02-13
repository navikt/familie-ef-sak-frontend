import { Heading, Table, Checkbox, BodyLong } from '@navikt/ds-react';
import React, { FC } from 'react';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import styled from 'styled-components';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';

const StyledTableDataCell = styled(Table.DataCell)`
    padding: 12px 8px 12px 0;
`;

const StyledBodyLong = styled(BodyLong)`
    white-space: break-spaces;
`;

export const TabellFerdigstilleOppgaver: FC<{
    fremleggsOppgaver: IOppgaverResponse;
    oppgaverSomSkalAutomatiskFerdigstilles: number[];
    handleSettOppgaverSomSkalFerdigstilles: (oppgaveId: number) => void;
}> = ({
    fremleggsOppgaver,
    oppgaverSomSkalAutomatiskFerdigstilles,
    handleSettOppgaverSomSkalFerdigstilles,
}) => {
    return (
        <>
            <Heading size="small">
                Bruker har følgende åpne fremleggsoppgaver. Huk av om du ønsker at noen av disse
                automatisk skal ferdigstilles ved godkjenning av dette vedtaket:
            </Heading>
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
                    {fremleggsOppgaver.oppgaver.map(
                        (
                            {
                                id,
                                oppgavetype,
                                behandlingstema,
                                behandlingstype,
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
                                            checked={oppgaverSomSkalAutomatiskFerdigstilles.includes(
                                                id
                                            )}
                                            onChange={() =>
                                                handleSettOppgaverSomSkalFerdigstilles(id)
                                            }
                                            aria-labelledby={`id-${id}`}
                                        >
                                            {' '}
                                        </Checkbox>
                                    </StyledTableDataCell>
                                    <Table.DataCell scope="row">
                                        {oppgavetype && oppgaveTypeTilTekst[oppgavetype]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {behandlingstema
                                            ? behandlingstemaTilTekst[behandlingstema]
                                            : behandlingstype}
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
        </>
    );
};
