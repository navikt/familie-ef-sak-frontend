import { Heading, Table, Checkbox, BodyLong } from '@navikt/ds-react';
import React, { FC } from 'react';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import styled from 'styled-components';
import { IOppgaverResponse } from '../../Oppgavebenk/OppgaveTabell';

const StyledTableDataCell = styled(Table.DataCell)`
    padding: 12px 8px 12px 0;
`;

const StyledBodyLong = styled(BodyLong)`
    white-space: break-spaces;
`;

export const TabellFerdigstilleOppgaver: FC<{
    fremleggsOppgaver: IOppgaverResponse;
    oppgaverSomSkalAutomatiskFerdigstilles: string[];
    handleSettOppgaverSomSkalFerdigstilles: (oppgaveId: string) => void;
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
                        <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
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
                                tilordnetRessurs,
                                endretTidspunkt,
                                aktivDato,
                                beskrivelse,
                            },
                            i
                        ) => {
                            const sistEndret = endretTidspunkt ?? aktivDato;
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
                                                id.toString()
                                            )}
                                            onChange={() =>
                                                handleSettOppgaverSomSkalFerdigstilles(
                                                    id.toString()
                                                )
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
                                        {behandlingstema &&
                                            behandlingstemaTilTekst[behandlingstema]}
                                    </Table.DataCell>
                                    <Table.DataCell>{tilordnetRessurs ?? '-'}</Table.DataCell>
                                    <Table.DataCell>
                                        {sistEndret && formaterIsoDato(sistEndret)}
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
