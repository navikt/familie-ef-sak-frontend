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
import Årvelger from '../../../Felles/Input/MånedÅr/ÅrVelger';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';

const StyledTableDataCell = styled(Table.DataCell)`
    padding: 12px 8px 12px 0;
`;

const StyledBodyLong = styled(BodyLong)`
    white-space: break-spaces;
`;

const StyledÅrvelger = styled(Årvelger)`
    max-width: fit-content;
`;

const MAKS_ANTALL_ÅR_TILBAKE = 0;
const MAKS_ANTALL_ÅR_FREM = 5;

// TODO: Rename??
export const MarkereGodkjenneVedtakModal: FC<{
    open: boolean;
    setOpen: (open: boolean) => void;
    oppgaverForOpprettelse?: IOppgaverForOpprettelse;
    sendTilBeslutterRequest: SendTilBeslutterRequest;
    settSendTilBeslutterRequest: React.Dispatch<React.SetStateAction<SendTilBeslutterRequest>>;
    sendTilBeslutter: (data?: SendTilBeslutterRequest) => void;
    fremleggsOppgaver: Ressurs<IOppgaverResponse>;
}> = ({
    open,
    setOpen,
    oppgaverForOpprettelse,
    sendTilBeslutterRequest,
    settSendTilBeslutterRequest,
    sendTilBeslutter,
    fremleggsOppgaver,
}) => {
    const { oppgavetyperSomSkalOpprettes, årForInntektskontrollSelvstendigNæringsdrivende } =
        sendTilBeslutterRequest;

    const { oppgavetyperSomKanOpprettes } = oppgaverForOpprettelse || {};

    const finnesOppgavetyperSomKanOpprettes = (oppgavetyperSomKanOpprettes ?? []).length > 0;

    const [oppgaverSomSkalAutomatiskFerdigstilles, settOppgaverSomSkalAutomatiskFerdigstilles] =
        useState<string[]>([]);

    useEffect(() => {
        if (finnesOppgavetyperSomKanOpprettes) {
            settSendTilBeslutterRequest({
                ...settSendTilBeslutterRequest,
                oppgavetyperSomSkalOpprettes: [
                    OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID,
                ],
                årForInntektskontrollSelvstendigNæringsdrivende: undefined,
            });
        }
    }, [finnesOppgavetyperSomKanOpprettes, settSendTilBeslutterRequest]);

    const handleSettÅr = (år: number) => {
        settSendTilBeslutterRequest({
            ...sendTilBeslutterRequest,
            årForInntektskontrollSelvstendigNæringsdrivende: år,
        });
    };

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
                                    onChange={(value) =>
                                        settSendTilBeslutterRequest({
                                            ...sendTilBeslutterRequest,
                                            oppgavetyperSomSkalOpprettes: [
                                                value as OppgaveTypeForOpprettelse,
                                            ],
                                            årForInntektskontrollSelvstendigNæringsdrivende:
                                                undefined,
                                        })
                                    }
                                    value={oppgavetyperSomSkalOpprettes[0]}
                                >
                                    <Radio value="INNTEKTSKONTROLL_1_ÅR_FREM_I_TID">
                                        Oppgave for kontroll av inntekt 1 år frem i tid
                                    </Radio>
                                    <Radio value="INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE">
                                        Oppgave til 15.desember{' '}
                                        {årForInntektskontrollSelvstendigNæringsdrivende
                                            ? årForInntektskontrollSelvstendigNæringsdrivende
                                            : '[velg år]'}{' '}
                                        for kontroll av inntekt for selvstendig næringsdrivende
                                    </Radio>
                                </RadioGroup>
                                {oppgavetyperSomSkalOpprettes[0] ===
                                    'INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE' && (
                                    <StyledÅrvelger
                                        år={årForInntektskontrollSelvstendigNæringsdrivende}
                                        settÅr={handleSettÅr}
                                        antallÅrTilbake={MAKS_ANTALL_ÅR_TILBAKE}
                                        antallÅrFrem={MAKS_ANTALL_ÅR_FREM}
                                        // lesevisning={lesevisning}
                                        size={'small'}
                                    />
                                )}
                                {JSON.stringify(årForInntektskontrollSelvstendigNæringsdrivende)}
                                {JSON.stringify(oppgavetyperSomSkalOpprettes)}
                                {JSON.stringify(sendTilBeslutterRequest)}
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
                                        oppgavetyperSomSkalOpprettes: [
                                            oppgavetyperSomSkalOpprettes[0] as OppgaveTypeForOpprettelse,
                                        ],
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
