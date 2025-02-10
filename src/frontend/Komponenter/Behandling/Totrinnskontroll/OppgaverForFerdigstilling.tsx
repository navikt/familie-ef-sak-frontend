import { Heading, Table, Checkbox, BodyLong } from '@navikt/ds-react';
import React, { FC, useEffect } from 'react';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import styled from 'styled-components';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';
import { useHentOppgaverForFerdigstilling } from '../../../App/hooks/useHentOppgaverForFerdigstilling';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../App/typer/ressurs';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';

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
}> = ({ behandlingId }) => {
    const { hentOppgaverForFerdigstilling, oppgaverForFerdigstilling } =
        useHentOppgaverForFerdigstilling();

    useEffect(() => {
        hentOppgaverForFerdigstilling(behandlingId);
    }, [behandlingId, hentOppgaverForFerdigstilling]);

    if (skalViseOppgaverForFerdigstilling(oppgaverForFerdigstilling)) {
        return;
    }

    return (
        <DataViewer response={{ oppgaverForFerdigstilling }}>
            {({ oppgaverForFerdigstilling }) => {
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
                                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                        <Table.HeaderCell />
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {oppgaverForFerdigstilling.oppgaver.map(
                                        (
                                            {
                                                id,
                                                oppgavetype,
                                                behandlingstema,
                                                behandlingstype,
                                                tilordnetRessurs,
                                                beskrivelse,
                                                fristFerdigstillelse,
                                                status,
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
                                                        {behandlingstema
                                                            ? behandlingstemaTilTekst[
                                                                  behandlingstema
                                                              ]
                                                            : behandlingstype}
                                                    </Table.DataCell>
                                                    <Table.DataCell>
                                                        {tilordnetRessurs ?? '-'}
                                                    </Table.DataCell>
                                                    <Table.DataCell>
                                                        {fristFerdigstillelse &&
                                                            formaterIsoDato(fristFerdigstillelse)}
                                                    </Table.DataCell>
                                                    <Table.DataCell>{status}</Table.DataCell>
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

const skalViseOppgaverForFerdigstilling = (
    oppgaverForFerdigstilling: Ressurs<IOppgaverResponse>
) => {
    return !(
        oppgaverForFerdigstilling.status === 'SUKSESS' &&
        oppgaverForFerdigstilling.data.antallTreffTotalt > 0
    );
};
