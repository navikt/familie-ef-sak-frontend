import { Heading, Table, Checkbox, BodyLong, Box } from '@navikt/ds-react';
import React, { FC, useEffect } from 'react';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import { useHentOppgaverForFerdigstilling } from '../../../App/hooks/useHentOppgaverForFerdigstilling';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../App/typer/ressurs';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';

export const OppgaverForFerdigstilling: FC<{
    behandlingId: string;
}> = ({ behandlingId }) => {
    const { hentOppgaverForFerdigstilling, oppgaverForFerdigstilling } =
        useHentOppgaverForFerdigstilling();

    useEffect(() => {
        hentOppgaverForFerdigstilling(behandlingId);
    }, [behandlingId, hentOppgaverForFerdigstilling]);

    if (skalIkkeViseOppgaverForFerdigstilling(oppgaverForFerdigstilling)) {
        return;
    }

    return (
        <DataViewer response={{ oppgaverForFerdigstilling }}>
            {({ oppgaverForFerdigstilling }) => {
                return (
                    <>
                        <Heading size="small">
                            Følgende oppgaver blir ferdigstilt når vedtaket er godkjent:
                        </Heading>
                        <Box background={'surface-alt-2-subtle'} padding="space-8">
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
                                                        <BodyLong
                                                            style={{ whiteSpace: 'break-spaces' }}
                                                        >
                                                            {beskrivelse}
                                                        </BodyLong>
                                                    }
                                                    togglePlacement="right"
                                                    expandOnRowClick
                                                >
                                                    <Table.DataCell
                                                        style={{ padding: '12px 8px 12px 0' }}
                                                    >
                                                        <Checkbox
                                                            hideLabel
                                                            checked
                                                            aria-labelledby={`id-${id}`}
                                                            readOnly
                                                        >
                                                            {' '}
                                                        </Checkbox>
                                                    </Table.DataCell>
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
                        </Box>
                    </>
                );
            }}
        </DataViewer>
    );
};

const skalIkkeViseOppgaverForFerdigstilling = (
    oppgaverForFerdigstilling: Ressurs<IOppgaverResponse>
) => {
    return !(
        oppgaverForFerdigstilling.status === 'SUKSESS' &&
        oppgaverForFerdigstilling.data.antallTreffTotalt > 0
    );
};
