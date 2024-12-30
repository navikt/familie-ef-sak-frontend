import {
    Modal,
    Button,
    Checkbox,
    VStack,
    Table,
    Heading,
    BodyLong,
    Radio,
    RadioGroup,
} from '@navikt/ds-react';
import React, { FC, useEffect, useState } from 'react';
import { Divider } from '../../../Felles/Divider/Divider';
import { styled } from 'styled-components';
import { IOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { Ressurs } from '../../../App/typer/ressurs';
import { IOppgaverResponse } from '../../Oppgavebenk/OppgaveTabell';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetype';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { SendTilBeslutterRequest } from './SendTilBeslutterFooter';

const StyledTableDataCell = styled(Table.DataCell)`
    padding: 12px 8px 12px 0;
`;

const StyledBodyLong = styled(BodyLong)`
    white-space: break-spaces;
`;

// TODO: Rename??
export const MarkereGodkjenneVedtakModal: FC<{
    open: boolean;
    setOpen: (open: boolean) => void;
    oppgaverForOpprettelse?: IOppgaverForOpprettelse;
    sendTilBeslutter: (data?: SendTilBeslutterRequest) => void;
    fremleggsOppgaver: Ressurs<IOppgaverResponse>;
}> = ({ open, setOpen, oppgaverForOpprettelse, sendTilBeslutter, fremleggsOppgaver }) => {
    const {
        // feilmelding,
        oppgavetyperSomKanOpprettes,
        // oppgavetyperSomSkalOpprettes,
        // settOppgavetyperSomSkalOpprettes,
    } = oppgaverForOpprettelse || {};

    const finnesOppgavetyperSomKanOpprettes = (oppgavetyperSomKanOpprettes ?? []).length > 0;

    const [oppgaverForOpprettelseState, settOppgaverForOpprettelseState] = useState<string>(''); // TODO: Navn??
    const [oppgaverSomSkalAutomatiskFerdigstilles, settOppgaverSomSkalAutomatiskFerdigstilles] =
        useState<string[]>([]);

    useEffect(() => {
        if (finnesOppgavetyperSomKanOpprettes) {
            settOppgaverForOpprettelseState('kontrollAvInntekt');
        }
    }, [finnesOppgavetyperSomKanOpprettes]);

    const handleSettOppgaverSomSkalFerdigstilles = (oppgaveId: string) =>
        settOppgaverSomSkalAutomatiskFerdigstilles((prevOppgaver) =>
            prevOppgaver.includes(oppgaveId)
                ? prevOppgaver.filter((id) => id !== oppgaveId)
                : [...prevOppgaver, oppgaveId]
        );

    return (
        <DataViewer response={{ fremleggsOppgaver }}>
            {({ fremleggsOppgaver }) => {
                return (
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        header={{
                            heading: '',
                            size: 'small',
                            closeButton: false,
                        }}
                        width={`${55}${'rem'}`}
                    >
                        <Modal.Body>
                            <VStack gap="4">
                                <RadioGroup
                                    legend="Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:"
                                    onChange={settOppgaverForOpprettelseState}
                                    value={oppgaverForOpprettelseState}
                                >
                                    <Radio value="kontrollAvInntekt">
                                        Oppgave for kontroll av inntekt 1 år frem i tid
                                    </Radio>
                                    <Radio value="kontrollAvSelvstendigNæringsdrivende">
                                        Oppgave til 15.desember 2025 for kontroll av inntekt for
                                        selvstendig næringsdrivende
                                    </Radio>
                                </RadioGroup>
                                {JSON.stringify(oppgaverForOpprettelseState)}
                                <Divider />
                                <>
                                    <Heading size="small">
                                        Bruker har følgende åpne fremleggsoppgaver. Huk av om du
                                        ønsker at noen av disse automatisk skal ferdigstilles ved
                                        godkjenning av dette vedtaket:
                                    </Heading>
                                    <Table>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell />
                                                <Table.HeaderCell scope="col">
                                                    Oppgavetype
                                                </Table.HeaderCell>
                                                <Table.HeaderCell scope="col">
                                                    Gjelder
                                                </Table.HeaderCell>
                                                <Table.HeaderCell scope="col">
                                                    Saksbehandler
                                                </Table.HeaderCell>
                                                <Table.HeaderCell scope="col">
                                                    Sist endret
                                                </Table.HeaderCell>
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
                                                                {oppgavetype &&
                                                                    oppgaveTypeTilTekst[
                                                                        oppgavetype
                                                                    ]}
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
                                                                {sistEndret &&
                                                                    formaterIsoDato(sistEndret)}
                                                            </Table.DataCell>
                                                        </Table.ExpandableRow>
                                                    );
                                                }
                                            )}
                                        </Table.Body>
                                    </Table>
                                    {JSON.stringify(oppgaverSomSkalAutomatiskFerdigstilles)}
                                </>
                            </VStack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="button"
                                onClick={() =>
                                    sendTilBeslutter({
                                        oppgavetyperSomSkalOpprettes:
                                            oppgaverForOpprettelse?.oppgavetyperSomSkalOpprettes ??
                                            [],
                                    })
                                }
                            >
                                Send til beslutter
                            </Button>
                            <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
                                Avbryt
                            </Button>
                        </Modal.Footer>
                    </Modal>
                );
            }}
        </DataViewer>
    );
};
