import { Button, HStack, Modal, VStack } from '@navikt/ds-react';
import React, { FC, useEffect, useState } from 'react';
import { LoddrettDivider, VannrettDivider } from '../../../Felles/Divider/Divider';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IOppgaverResponse } from '../../../App/hooks/useHentOppgaver';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { SendTilBeslutterRequest } from './SendTilBeslutter';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';
import { FremleggsoppgaverForOpprettelse } from './FremleggsoppgaverForOpprettelse';
import { TabellFerdigstilleOppgaver } from './TabellFerdigstilleOppgaver';
import { BeskrivelseMarkeringer, BeskrivelseOppgave } from './BeskrivelseOppgave';
import { AutomatiskBrev, AutomatiskBrevValg } from './AutomatiskBrev';
import { Behandling } from '../../../App/typer/fagsak';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { harBarnMellomSeksOgTolvMåneder, utledAutomatiskBrev } from './utils';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Oppfølgingsoppgave } from '../../../App/hooks/useHentOppfølgingsoppgave';

export const ModalSendTilBeslutter: FC<{
    behandling: Behandling;
    vilkår?: IVilkår;
    open: boolean;
    setOpen: (open: boolean) => void;
    sendTilBeslutter: (data: SendTilBeslutterRequest) => void;
    oppgaverForAutomatiskFerdigstilling: Ressurs<IOppgaverResponse>;
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[] | undefined;
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    settOppgavetyperSomSkalOpprettes: React.Dispatch<
        React.SetStateAction<OppgaveTypeForOpprettelse[]>
    >;
    oppgaverSomSkalAutomatiskFerdigstilles: number[];
    settOppgaverSomSkalAutomatiskFerdigstilles: React.Dispatch<React.SetStateAction<number[]>>;
    avslagValg: {
        ferdigstillUtenBeslutter: boolean;
        erAvslagSkalSendeTilBeslutter: boolean;
        erAvslag: boolean;
        erInnvilgelseOvergangsstønad: boolean;
    };
    oppfølgingsoppgave?: Oppfølgingsoppgave;
}> = ({
    behandling,
    vilkår,
    open,
    setOpen,
    sendTilBeslutter,
    oppgaverForAutomatiskFerdigstilling,
    oppgavetyperSomKanOpprettes,
    oppgavetyperSomSkalOpprettes,
    settOppgavetyperSomSkalOpprettes,
    oppgaverSomSkalAutomatiskFerdigstilles,
    settOppgaverSomSkalAutomatiskFerdigstilles,
    avslagValg,
    oppfølgingsoppgave,
}) => {
    const [
        årForInntektskontrollSelvstendigNæringsdrivende,
        settÅrForInntektskontrollSelvstendigNæringsdrivende,
    ] = useState<number | undefined>();

    const [beskrivelseMarkeringer, settBeskrivelseMarkeringer] = useState<BeskrivelseMarkeringer[]>(
        []
    );

    const {
        ferdigstillUtenBeslutter,
        erAvslagSkalSendeTilBeslutter,
        erAvslag,
        erInnvilgelseOvergangsstønad,
    } = avslagValg;

    const [automatiskBrev, settAutomatiskBrev] = useState<AutomatiskBrevValg[]>(
        utledAutomatiskBrev(
            oppfølgingsoppgave?.automatiskBrev,
            erInnvilgelseOvergangsstønad,
            vilkår
        )
    );

    const handleSettOppgaverSomSkalFerdigstilles = (oppgaveId: number) =>
        settOppgaverSomSkalAutomatiskFerdigstilles((prevOppgaver) =>
            prevOppgaver.includes(oppgaveId)
                ? prevOppgaver.filter((id) => id !== oppgaveId)
                : [...prevOppgaver, oppgaveId]
        );

    const harOppgaver =
        oppgaverForAutomatiskFerdigstilling.status === RessursStatus.SUKSESS &&
        oppgaverForAutomatiskFerdigstilling.data.oppgaver.length > 0;

    const kanVelgeMellomFlereOppgavetyper = (oppgavetyperSomKanOpprettes ?? []).length > 1;
    const harValgtAnnetEnnInntektskontroll =
        kanVelgeMellomFlereOppgavetyper &&
        !oppgavetyperSomSkalOpprettes.includes(
            OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE
        );

    const harValgtInntektskontrollOgÅr =
        oppgavetyperSomSkalOpprettes.includes(
            OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE
        ) && årForInntektskontrollSelvstendigNæringsdrivende;

    const harValgtIngen =
        !kanVelgeMellomFlereOppgavetyper && oppgavetyperSomSkalOpprettes.length === 0;

    const erValgIRadioEllerChecboxGroupGyldig =
        harValgtAnnetEnnInntektskontroll || harValgtInntektskontrollOgÅr || harValgtIngen;

    const ferdigstillTittel = ferdigstillUtenBeslutter
        ? 'Ferdigstill behandling'
        : 'Send til beslutter';

    const skalViseFremleggsoppgaverForOpprettelseOgFerdigstilling =
        !erAvslag || !erAvslagSkalSendeTilBeslutter;

    const harBarnMellomSeksOgTolvMnder = vilkår && harBarnMellomSeksOgTolvMåneder(vilkår);
    const erOvergangsstønad = behandling.stønadstype === Stønadstype.OVERGANGSSTØNAD;
    const skalViseHøyremeny =
        (erInnvilgelseOvergangsstønad && harBarnMellomSeksOgTolvMnder && erOvergangsstønad) ||
        !ferdigstillUtenBeslutter;

    useEffect(() => {
        settAutomatiskBrev(
            utledAutomatiskBrev(
                oppfølgingsoppgave?.automatiskBrev,
                erInnvilgelseOvergangsstønad,
                vilkår
            )
        );
    }, [behandling, erInnvilgelseOvergangsstønad, oppfølgingsoppgave?.automatiskBrev, vilkår]);

    return (
        <DataViewer response={{ oppgaverForAutomatiskFerdigstilling }}>
            {({ oppgaverForAutomatiskFerdigstilling }) => {
                return (
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        header={{ heading: '', size: 'small', closeButton: false }}
                        width={`${55}${'rem'}`}
                    >
                        <Modal.Body>
                            <HStack>
                                <VStack gap="4">
                                    {skalViseFremleggsoppgaverForOpprettelseOgFerdigstilling && (
                                        <>
                                            <FremleggsoppgaverForOpprettelse
                                                årForInntektskontrollSelvstendigNæringsdrivende={
                                                    årForInntektskontrollSelvstendigNæringsdrivende
                                                }
                                                oppgavetyperSomKanOpprettes={
                                                    oppgavetyperSomKanOpprettes
                                                }
                                                oppgavetyperSomSkalOpprettes={
                                                    oppgavetyperSomSkalOpprettes
                                                }
                                                settOppgavetyperSomSkalOpprettes={
                                                    settOppgavetyperSomSkalOpprettes
                                                }
                                                settÅrForInntektskontrollSelvstendigNæringsdrivende={
                                                    settÅrForInntektskontrollSelvstendigNæringsdrivende
                                                }
                                            />
                                            {harOppgaver && (
                                                <>
                                                    <VannrettDivider />
                                                    <TabellFerdigstilleOppgaver
                                                        oppgaverForAutomatiskFerdigstilling={
                                                            oppgaverForAutomatiskFerdigstilling
                                                        }
                                                        oppgaverSomSkalAutomatiskFerdigstilles={
                                                            oppgaverSomSkalAutomatiskFerdigstilles
                                                        }
                                                        handleSettOppgaverSomSkalFerdigstilles={
                                                            handleSettOppgaverSomSkalFerdigstilles
                                                        }
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}
                                </VStack>
                                {skalViseHøyremeny && (
                                    <>
                                        <LoddrettDivider />
                                        <VStack gap="4">
                                            {erInnvilgelseOvergangsstønad &&
                                                harBarnMellomSeksOgTolvMnder &&
                                                erOvergangsstønad && (
                                                    <AutomatiskBrev
                                                        automatiskBrev={automatiskBrev}
                                                        settAutomatiskBrev={settAutomatiskBrev}
                                                    />
                                                )}
                                            {!ferdigstillUtenBeslutter && (
                                                <>
                                                    {skalViseFremleggsoppgaverForOpprettelseOgFerdigstilling && (
                                                        <VannrettDivider />
                                                    )}
                                                    <BeskrivelseOppgave
                                                        beskrivelseMarkeringer={
                                                            beskrivelseMarkeringer
                                                        }
                                                        settBeskrivelseMarkeringer={
                                                            settBeskrivelseMarkeringer
                                                        }
                                                    />
                                                </>
                                            )}
                                        </VStack>{' '}
                                    </>
                                )}
                            </HStack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="button"
                                onClick={() =>
                                    sendTilBeslutter({
                                        oppgavetyperSomSkalOpprettes:
                                            oppgavetyperSomSkalOpprettes.length > 0 &&
                                            oppgavetyperSomSkalOpprettes[0].trim() !== ''
                                                ? [oppgavetyperSomSkalOpprettes[0]]
                                                : [],
                                        årForInntektskontrollSelvstendigNæringsdrivende:
                                            årForInntektskontrollSelvstendigNæringsdrivende,
                                        oppgaverIderSomSkalFerdigstilles:
                                            oppgaverSomSkalAutomatiskFerdigstilles,
                                        beskrivelseMarkeringer: beskrivelseMarkeringer,
                                        automatiskBrev: automatiskBrev,
                                    })
                                }
                                disabled={!erValgIRadioEllerChecboxGroupGyldig}
                            >
                                {ferdigstillTittel}
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
