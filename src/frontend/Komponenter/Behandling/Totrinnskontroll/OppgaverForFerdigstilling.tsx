import { Heading, Table, Checkbox, BodyLong } from '@navikt/ds-react';
import React, { FC, useEffect } from 'react';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import styled from 'styled-components';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';
import { useHentFerdigestilteFremleggsoppgaver } from '../../../App/hooks/useHentFerdigstilteFremleggsoppgaver';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';
import { Ressurs } from '../../../App/typer/ressurs';

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
    behandlingId: string;
    fremleggsoppgaver: Ressurs<IOppgaverResponse>;
    fremleggsoppgaveIderSomSkalFerdigstilles: number[];
}> = ({ behandlingId, fremleggsoppgaver, fremleggsoppgaveIderSomSkalFerdigstilles }) => {
    const { hentFerdigstilteFremleggsoppgaver, ferdigstilteFremleggsoppgaver } =
        useHentFerdigestilteFremleggsoppgaver();

    useEffect(() => {
        hentFerdigstilteFremleggsoppgaver(behandlingId);
    }, [behandlingId, hentFerdigstilteFremleggsoppgaver]);

    if (!fremleggsoppgaver || fremleggsoppgaveIderSomSkalFerdigstilles.length === 0) {
        return;
    }

    return (
        <DataViewer response={{ ferdigstilteFremleggsoppgaver, fremleggsoppgaver }}>
            {({ ferdigstilteFremleggsoppgaver, fremleggsoppgaver }) => {
                const fremleggsOppgaverSomSkalFerdigstilles = fremleggsoppgaver?.oppgaver?.filter(
                    ({ id }) => fremleggsoppgaveIderSomSkalFerdigstilles?.includes(id)
                );

                const oppgaver =
                    ferdigstilteFremleggsoppgaver.oppgaver.length > 0
                        ? ferdigstilteFremleggsoppgaver.oppgaver
                        : fremleggsOppgaverSomSkalFerdigstilles;

                return (
                    <>
                        <Heading size="small">
                            Følgende fremleggsoppgaver ferdigstilles ved godkjenning av dette
                            vedtaket:
                        </Heading>
                        <TableContainer>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell />
                                        <Table.HeaderCell scope="col">Oppgavetype</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Gjelder</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">
                                            Saksbehandler
                                        </Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Frist</Table.HeaderCell>
                                        <Table.HeaderCell />
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {oppgaver.map(
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
                                                    content={
                                                        <StyledBodyLong>
                                                            {beskrivelse}
                                                        </StyledBodyLong>
                                                    }
                                                    togglePlacement="right"
                                                    expandOnRowClick
                                                >
                                                    <StyledTableDataCell>
                                                        <Checkbox
                                                            hideLabel
                                                            checked
                                                            aria-labelledby={`id-${id}`}
                                                            readOnly
                                                        >
                                                            {' '}
                                                        </Checkbox>
                                                    </StyledTableDataCell>
                                                    <Table.DataCell scope="row">
                                                        {oppgavetype &&
                                                            oppgaveTypeTilTekst[oppgavetype]}
                                                    </Table.DataCell>
                                                    <Table.DataCell>
                                                        {behandlingstema &&
                                                            behandlingstemaTilTekst[
                                                                behandlingstema
                                                            ]}
                                                    </Table.DataCell>
                                                    <Table.DataCell>
                                                        {tilordnetRessurs ?? '-'}
                                                    </Table.DataCell>
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
            }}
        </DataViewer>
    );
};
