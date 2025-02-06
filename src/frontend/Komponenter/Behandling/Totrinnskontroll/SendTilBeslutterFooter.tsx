import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Button } from '@navikt/ds-react';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { useNavigate } from 'react-router-dom';
import OppgaverForOpprettelse from './OppgaverForOpprettelse';
import { Behandling } from '../../../App/typer/fagsak';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';
import { ModalState } from '../Modal/NyEierModal';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { ModalOpprettOgFerdigstilleOppgaver } from './ModalOpprettOgFerdigstilleOppgaver';
import { useHentFremleggsoppgaverForOvergangsstønad } from '../../../App/hooks/useHentFremleggsoppgaverForOvergangsstønad';

const Footer = styled.footer`
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: ${ABorderStrong};
    z-index: 1;
`;

const MidtstiltInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 50%;
`;

const FlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export interface SendTilBeslutterRequest {
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    årForInntektskontrollSelvstendigNæringsdrivende?: number;
    fremleggsoppgaveIderSomSkalFerdigstilles: number[];
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

const SendTilBeslutterFooter: React.FC<{
    behandling: Behandling;
    kanSendesTilBeslutter?: boolean;
    behandlingErRedigerbar: boolean;
    ferdigstillUtenBeslutter: boolean;
    oppgavetyperSomKanOpprettes?: OppgaveTypeForOpprettelse[];
    hentOppgaverForOpprettelseCallback?: {
        rerun: () => void;
    };
    fremleggsoppgaveIderSomSkalFerdigstilles?: number[];
    hentOppgaveIderForFerdigstillingCallback?: {
        rerun: () => void;
    };
}> = ({
    behandling,
    kanSendesTilBeslutter,
    behandlingErRedigerbar,
    ferdigstillUtenBeslutter,
    oppgavetyperSomKanOpprettes,
    hentOppgaverForOpprettelseCallback,
    fremleggsoppgaveIderSomSkalFerdigstilles,
    hentOppgaveIderForFerdigstillingCallback,
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
    const { toggles } = useToggles();
    const { hentFremleggsoppgaver, fremleggsoppgaver } =
        useHentFremleggsoppgaverForOvergangsstønad();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [visMarkereGodkjenneVedtakOppgaveModal, settVisMarkereGodkjenneVedtakOppgaveModal] =
        useState<boolean>(false);
    const [oppgavetyperSomSkalOpprettes, settOppgavetyperSomSkalOpprettes] = useState<
        OppgaveTypeForOpprettelse[]
    >(utledDefaultOppgavetyperSomSkalOpprettes(oppgavetyperSomKanOpprettes));
    const [
        årForInntektskontrollSelvstendigNæringsdrivende,
        settÅrForInntektskontrollSelvstendigNæringsdrivende,
    ] = useState<number | undefined>();
    const [oppgaverSomSkalAutomatiskFerdigstilles, settOppgaverSomSkalAutomatiskFerdigstilles] =
        useState<number[]>(fremleggsoppgaveIderSomSkalFerdigstilles || []);

    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, SendTilBeslutterRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/send-til-beslutter`,
            data: {
                oppgavetyperSomSkalOpprettes: oppgavetyperSomSkalOpprettes,
                årForInntektskontrollSelvstendigNæringsdrivende:
                    årForInntektskontrollSelvstendigNæringsdrivende,
                fremleggsoppgaveIderSomSkalFerdigstilles: oppgaverSomSkalAutomatiskFerdigstilles,
            },
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    hentVedtak.rerun();
                    hentAnsvarligSaksbehandler.rerun();
                    hentTotrinnskontroll.rerun();
                    settVisMarkereGodkjenneVedtakOppgaveModal(false);
                    hentOppgaverForOpprettelseCallback?.rerun();
                    hentOppgaveIderForFerdigstillingCallback?.rerun();
                    settVisModal(true);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                    settNyEierModalState(ModalState.LUKKET);
                    hentAnsvarligSaksbehandler.rerun();
                }
            })
            .finally(() => settLaster(false));
    };

    const toggleVisKnappForModal =
        toggles[ToggleName.visMarkereGodkjenneVedtakOppgaveModal] || false;

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

    const skalViseKnappForModal =
        toggleVisKnappForModal &&
        oppgavetyperSomKanOpprettes &&
        oppgavetyperSomKanOpprettes.length > 0;

    useEffect(() => {
        hentFremleggsoppgaver(behandling.id);
    }, [behandling.id, hentFremleggsoppgaver]);

    return (
        <>
            {behandlingErRedigerbar && (
                <Footer>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    {ferdigstillUtenBeslutter && (
                        <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                    )}
                    <FlexBox>
                        {/* TODO: Dette skal fjernes etter at ny modal er togglet på for alle */}
                        {oppgavetyperSomKanOpprettes && (
                            <OppgaverForOpprettelse
                                oppgavetyperSomKanOpprettes={oppgavetyperSomKanOpprettes}
                                oppgavetyperSomSkalOpprettes={oppgavetyperSomSkalOpprettes}
                                settOppgavetyperSomSkalOpprettes={settOppgavetyperSomSkalOpprettes}
                            />
                        )}
                        <MidtstiltInnhold>
                            {skalViseKnappForModal && (
                                <Button
                                    onClick={() => settVisMarkereGodkjenneVedtakOppgaveModal(true)}
                                    variant="danger"
                                    type={'button'}
                                    disabled={!kanSendesTilBeslutter || laster}
                                >
                                    Opprettelse av oppgaver - TEST
                                </Button>
                            )}
                            <Button
                                onClick={sendTilBeslutter}
                                disabled={laster || !kanSendesTilBeslutter}
                                type={'button'}
                            >
                                {ferdigstillTittel}
                            </Button>
                        </MidtstiltInnhold>
                    </FlexBox>
                </Footer>
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
                    lukkKnapp: {
                        onClick: () => lukkModal(),
                        tekst: 'Lukk',
                    },
                    marginTop: 4,
                }}
            />
            {toggleVisKnappForModal && (
                <ModalOpprettOgFerdigstilleOppgaver
                    open={visMarkereGodkjenneVedtakOppgaveModal}
                    setOpen={settVisMarkereGodkjenneVedtakOppgaveModal}
                    sendTilBeslutter={sendTilBeslutter}
                    oppgavetyperSomKanOpprettes={oppgavetyperSomKanOpprettes}
                    oppgavetyperSomSkalOpprettes={oppgavetyperSomSkalOpprettes}
                    settOppgavetyperSomSkalOpprettes={settOppgavetyperSomSkalOpprettes}
                    årForInntektskontrollSelvstendigNæringsdrivende={
                        årForInntektskontrollSelvstendigNæringsdrivende
                    }
                    settÅrForInntektskontrollSelvstendigNæringsdrivende={
                        settÅrForInntektskontrollSelvstendigNæringsdrivende
                    }
                    fremleggsOppgaver={fremleggsoppgaver}
                    oppgaverSomSkalAutomatiskFerdigstilles={oppgaverSomSkalAutomatiskFerdigstilles}
                    settOppgaverSomSkalAutomatiskFerdigstilles={
                        settOppgaverSomSkalAutomatiskFerdigstilles
                    }
                />
            )}
        </>
    );
};

export default SendTilBeslutterFooter;
