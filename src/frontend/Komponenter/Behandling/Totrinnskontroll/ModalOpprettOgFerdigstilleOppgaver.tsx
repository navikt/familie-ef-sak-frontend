import { Modal, Button, VStack } from '@navikt/ds-react';
import React, { FC } from 'react';
import { Divider } from '../../../Felles/Divider/Divider';
import { Ressurs } from '../../../App/typer/ressurs';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { SendTilBeslutterRequest } from './SendTilBeslutterFooter';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';
import { FremleggsoppgaverForOpprettelse } from './FremleggsoppgaverForOpprettelse';
import { TabellFerdigstilleOppgaver } from './TabellFerdigstilleOppgaver';

export const ModalOpprettOgFerdigstilleOppgaver: FC<{
    open: boolean;
    setOpen: (open: boolean) => void;
    sendTilBeslutter: (data?: SendTilBeslutterRequest) => void;
    fremleggsOppgaver: Ressurs<IOppgaverResponse>;
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[] | undefined;
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    settOppgavetyperSomSkalOpprettes: React.Dispatch<
        React.SetStateAction<OppgaveTypeForOpprettelse[]>
    >;
    årForInntektskontrollSelvstendigNæringsdrivende: number | undefined;
    settÅrForInntektskontrollSelvstendigNæringsdrivende: React.Dispatch<
        React.SetStateAction<number | undefined>
    >;
    oppgaverSomSkalAutomatiskFerdigstilles: number[];
    settOppgaverSomSkalAutomatiskFerdigstilles: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({
    open,
    setOpen,
    sendTilBeslutter,
    fremleggsOppgaver,
    oppgavetyperSomKanOpprettes,
    oppgavetyperSomSkalOpprettes,
    settOppgavetyperSomSkalOpprettes,
    årForInntektskontrollSelvstendigNæringsdrivende,
    settÅrForInntektskontrollSelvstendigNæringsdrivende,
    oppgaverSomSkalAutomatiskFerdigstilles,
    settOppgaverSomSkalAutomatiskFerdigstilles,
}) => {
    const handleSettOppgaverSomSkalFerdigstilles = (oppgaveId: number) =>
        settOppgaverSomSkalAutomatiskFerdigstilles((prevOppgaver) =>
            prevOppgaver.includes(oppgaveId)
                ? prevOppgaver.filter((id) => id !== oppgaveId)
                : [...prevOppgaver, oppgaveId]
        );

    const kanVelgeMellomFlereOppgavetyper = (oppgavetyperSomKanOpprettes ?? []).length > 1;

    const erValgIRadioEllerChecboxGroupGyldig =
        (kanVelgeMellomFlereOppgavetyper &&
            oppgavetyperSomSkalOpprettes.length > 0 &&
            !oppgavetyperSomSkalOpprettes.includes(
                OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE
            )) ||
        !!årForInntektskontrollSelvstendigNæringsdrivende ||
        (!kanVelgeMellomFlereOppgavetyper &&
            oppgavetyperSomKanOpprettes &&
            oppgavetyperSomKanOpprettes.includes(
                OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID
            ));

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
                                    settOppgavetyperSomSkalOpprettes={
                                        settOppgavetyperSomSkalOpprettes
                                    }
                                    settÅrForInntektskontrollSelvstendigNæringsdrivende={
                                        settÅrForInntektskontrollSelvstendigNæringsdrivende
                                    }
                                />
                                <Divider />
                                {fremleggsOppgaver.oppgaver.length > 0 && (
                                    <TabellFerdigstilleOppgaver
                                        fremleggsOppgaver={fremleggsOppgaver}
                                        oppgaverSomSkalAutomatiskFerdigstilles={
                                            oppgaverSomSkalAutomatiskFerdigstilles
                                        }
                                        handleSettOppgaverSomSkalFerdigstilles={
                                            handleSettOppgaverSomSkalFerdigstilles
                                        }
                                    />
                                )}
                            </VStack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="button"
                                onClick={() =>
                                    sendTilBeslutter({
                                        oppgavetyperSomSkalOpprettes: [
                                            oppgavetyperSomSkalOpprettes[0],
                                        ],
                                        årForInntektskontrollSelvstendigNæringsdrivende:
                                            årForInntektskontrollSelvstendigNæringsdrivende,
                                        fremleggsoppgaveIderSomSkalFerdigstilles:
                                            oppgaverSomSkalAutomatiskFerdigstilles,
                                    })
                                }
                                disabled={!erValgIRadioEllerChecboxGroupGyldig}
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
