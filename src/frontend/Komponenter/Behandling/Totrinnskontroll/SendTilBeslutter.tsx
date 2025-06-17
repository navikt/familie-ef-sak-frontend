import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Button } from '@navikt/ds-react';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { useNavigate } from 'react-router-dom';
import { Behandling } from '../../../App/typer/fagsak';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';
import { ModalState } from '../Modal/NyEierModal';
import { ModalSendTilBeslutter } from './ModalSendTilBeslutter';
import { Oppfølgingsoppgave } from '../../../App/hooks/useHentOppfølgingsoppgave';
import { BeskrivelseMarkeringer } from './BeskrivelseOppgave';
import { AutomatiskBrevValg } from './AutomatiskBrev';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { IVedtak } from '../../../App/typer/vedtak';
import { utledAvslagValg } from '../VedtakOgBeregning/Felles/utils';
import { useHentOppgaveForBeslutter } from '../../../App/hooks/useHentOppgaveForBeslutter';
import { Stønadstype } from '../../../App/typer/behandlingstema';

const FlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export interface SendTilBeslutterRequest {
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    årForInntektskontrollSelvstendigNæringsdrivende?: number;
    oppgaverIderSomSkalFerdigstilles?: number[];
    beskrivelseMarkeringer?: BeskrivelseMarkeringer[];
    automatiskBrev?: AutomatiskBrevValg[];
}

const utledDefaultOppgavetyperSomSkalOpprettes = (
    oppgaveTyperSomKanOpprettes: OppgaveTypeForOpprettelse[] | undefined
) => {
    if (!oppgaveTyperSomKanOpprettes) {
        return [];
    }

    return oppgaveTyperSomKanOpprettes.includes(
        OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID
    )
        ? [OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID]
        : [];
};

const SendTilBeslutter: React.FC<{
    behandling: Behandling;
    vilkår?: IVilkår;
    vedtak?: IVedtak;
    kanSendesTilBeslutter?: boolean;
    behandlingErRedigerbar: boolean;
    hentOppfølgingsoppgave?: { rerun: () => void };
    oppfølgingsoppgave?: Oppfølgingsoppgave;
    settErDokumentInnlastet?: Dispatch<SetStateAction<boolean>>;
}> = ({
    behandling,
    vilkår,
    vedtak,
    kanSendesTilBeslutter,
    behandlingErRedigerbar,
    hentOppfølgingsoppgave,
    oppfølgingsoppgave,
    settErDokumentInnlastet,
}) => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    const {
        hentTotrinnskontroll,
        hentAnsvarligSaksbehandler,
        hentBehandling,
        hentVedtak,
        hentBehandlingshistorikk,
        settNyEierModalState,
    } = useBehandling();
    const { hentOppgaverForBeslutter, oppgaverForBeslutter } = useHentOppgaveForBeslutter();
    const oppgavetyperSomKanOpprettesOvergangsstønad =
        oppfølgingsoppgave?.oppgaverForOpprettelse?.oppgavetyperSomKanOpprettes;
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [visMarkereGodkjenneVedtakOppgaveModal, settVisMarkereGodkjenneVedtakOppgaveModal] =
        useState<boolean>(false);
    const [oppgavetyperSomSkalOpprettes, settOppgavetyperSomSkalOpprettes] = useState<
        OppgaveTypeForOpprettelse[]
    >(utledDefaultOppgavetyperSomSkalOpprettes(oppgavetyperSomKanOpprettesOvergangsstønad));
    const [oppgaverSomSkalAutomatiskFerdigstilles, settOppgaverSomSkalAutomatiskFerdigstilles] =
        useState<number[]>(oppfølgingsoppgave?.oppgaveIderForFerdigstilling || []);
    const [avslagValg, settAvslagValg] = useState<{
        ferdigstillUtenBeslutter: boolean;
        erAvslagSkalSendeTilBeslutter: boolean;
        erAvslag: boolean;
        erInnvilgelseOvergangsstønad: boolean;
    }>(utledAvslagValg(vedtak));

    const { ferdigstillUtenBeslutter } = avslagValg;

    const sendTilBeslutter = (data: SendTilBeslutterRequest) => {
        if (laster) return;

        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, SendTilBeslutterRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/send-til-beslutter`,
            data: data,
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settErDokumentInnlastet && settErDokumentInnlastet(false);
                    hentBehandling.rerun();
                    hentVedtak.rerun();
                    hentAnsvarligSaksbehandler.rerun();
                    hentTotrinnskontroll.rerun();
                    settVisMarkereGodkjenneVedtakOppgaveModal(false);
                    hentOppfølgingsoppgave?.rerun();
                    settVisModal(true);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                    settNyEierModalState(ModalState.LUKKET);
                    hentAnsvarligSaksbehandler.rerun();
                }
            })
            .finally(() => settLaster(false));
    };

    const lukkModal = () => {
        settVisModal(false);
        hentBehandling.rerun();
        hentBehandlingshistorikk.rerun();
    };

    const ferdigstillTittel = ferdigstillUtenBeslutter
        ? 'Ferdigstill behandling'
        : 'Send til beslutter';
    const modalTittel = ferdigstillUtenBeslutter
        ? 'Vedtaket er ferdigstilt'
        : 'Vedtaket er sendt til beslutter';

    const skalViseKnappForModal = behandling.stønadstype == Stønadstype.OVERGANGSSTØNAD;

    useEffect(() => {
        hentOppgaverForBeslutter(behandling.id);
    }, [behandling.id, hentOppgaverForBeslutter]);

    useEffect(() => {
        settOppgavetyperSomSkalOpprettes(
            utledDefaultOppgavetyperSomSkalOpprettes(oppgavetyperSomKanOpprettesOvergangsstønad)
        );
    }, [oppgavetyperSomKanOpprettesOvergangsstønad]);

    useEffect(() => {
        settAvslagValg(utledAvslagValg(vedtak));
    }, [vedtak]);

    return (
        <>
            {behandlingErRedigerbar && (
                <>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    {ferdigstillUtenBeslutter && (
                        <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                    )}
                    <FlexBox>
                        <div>
                            {skalViseKnappForModal ? (
                                <Button
                                    onClick={() => settVisMarkereGodkjenneVedtakOppgaveModal(true)}
                                    type={'button'}
                                    disabled={!kanSendesTilBeslutter || laster}
                                >
                                    {ferdigstillTittel}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() =>
                                        sendTilBeslutter({
                                            oppgavetyperSomSkalOpprettes:
                                                oppgavetyperSomSkalOpprettes,
                                        })
                                    }
                                    disabled={laster || !kanSendesTilBeslutter}
                                    type={'button'}
                                >
                                    {ferdigstillTittel}
                                </Button>
                            )}
                        </div>
                    </FlexBox>
                </>
            )}
            <ModalWrapper
                tittel={modalTittel}
                visModal={visModal}
                onClose={() => settVisModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => navigate('/oppgavebenk'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Lukk' },
                    marginTop: 4,
                }}
            />
            <ModalSendTilBeslutter
                behandling={behandling}
                vilkår={vilkår}
                open={visMarkereGodkjenneVedtakOppgaveModal}
                setOpen={settVisMarkereGodkjenneVedtakOppgaveModal}
                sendTilBeslutter={sendTilBeslutter}
                oppgavetyperSomKanOpprettes={oppgavetyperSomKanOpprettesOvergangsstønad}
                oppgavetyperSomSkalOpprettes={oppgavetyperSomSkalOpprettes}
                settOppgavetyperSomSkalOpprettes={settOppgavetyperSomSkalOpprettes}
                oppgaverForBeslutter={oppgaverForBeslutter}
                oppgaverSomSkalAutomatiskFerdigstilles={oppgaverSomSkalAutomatiskFerdigstilles}
                settOppgaverSomSkalAutomatiskFerdigstilles={
                    settOppgaverSomSkalAutomatiskFerdigstilles
                }
                avslagValg={avslagValg}
                oppfølgingsoppgave={oppfølgingsoppgave}
            />
        </>
    );
};

export default SendTilBeslutter;
