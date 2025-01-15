import { Modal, Button, VStack } from '@navikt/ds-react';
import React, { FC, useEffect, useState } from 'react';
import { Divider } from '../../../Felles/Divider/Divider';
import { IOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { Ressurs } from '../../../App/typer/ressurs';
import { IOppgaverResponse } from '../../Oppgavebenk/OppgaveTabell';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { SendTilBeslutterRequest } from './SendTilBeslutterFooter';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';
import { FremleggsoppgaverForOpprettelse } from './FremleggsoppgaverForOpprettelse';
import { TabellFerdigstilleOppgaver } from './TabellFerdigstilleOppgaver';

export const ModalOpprettOgFerdigstilleOppgaver: FC<{
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
        const defaultValgtOppgavetype =
            oppgavetyperSomKanOpprettes &&
            oppgavetyperSomKanOpprettes.includes(
                OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID
            )
                ? [OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID]
                : [];

        if (finnesOppgavetyperSomKanOpprettes) {
            settSendTilBeslutterRequest({
                ...settSendTilBeslutterRequest,
                oppgavetyperSomSkalOpprettes: defaultValgtOppgavetype,
                årForInntektskontrollSelvstendigNæringsdrivende: undefined,
            });
        }
    }, [
        finnesOppgavetyperSomKanOpprettes,
        oppgavetyperSomKanOpprettes,
        settSendTilBeslutterRequest,
    ]);

    const handleSettOppgaverSomSkalFerdigstilles = (oppgaveId: string) =>
        settOppgaverSomSkalAutomatiskFerdigstilles((prevOppgaver) =>
            prevOppgaver.includes(oppgaveId)
                ? prevOppgaver.filter((id) => id !== oppgaveId)
                : [...prevOppgaver, oppgaveId]
        );

    const kanVelgeMellomFlereOppgavetyper =
        oppgavetyperSomKanOpprettes && oppgavetyperSomKanOpprettes?.length > 1;

    const harValgIRadioGroup =
        kanVelgeMellomFlereOppgavetyper &&
        oppgavetyperSomSkalOpprettes.length > 0 &&
        (!oppgavetyperSomSkalOpprettes.includes(
            OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE
        ) ||
            !!årForInntektskontrollSelvstendigNæringsdrivende);

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
                                <FremleggsoppgaverForOpprettelse
                                    årForInntektskontrollSelvstendigNæringsdrivende={
                                        årForInntektskontrollSelvstendigNæringsdrivende
                                    }
                                    oppgavetyperSomKanOpprettes={oppgavetyperSomKanOpprettes}
                                    oppgavetyperSomSkalOpprettes={oppgavetyperSomSkalOpprettes}
                                    sendTilBeslutterRequest={sendTilBeslutterRequest}
                                    settSendTilBeslutterRequest={settSendTilBeslutterRequest}
                                />
                                <Divider />
                                <TabellFerdigstilleOppgaver
                                    fremleggsOppgaver={fremleggsOppgaver}
                                    oppgaverSomSkalAutomatiskFerdigstilles={
                                        oppgaverSomSkalAutomatiskFerdigstilles
                                    }
                                    handleSettOppgaverSomSkalFerdigstilles={
                                        handleSettOppgaverSomSkalFerdigstilles
                                    }
                                />
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
                                disabled={!harValgIRadioGroup}
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
