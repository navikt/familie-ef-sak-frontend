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
import { IOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { OppgaveTypeForOpprettelse } from './oppgaveForOpprettelseTyper';
import { harVerdi } from '../../../App/utils/utils';
import { ModalState } from '../Modal/NyEierModal';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { useHentOppgaver } from '../../../App/hooks/useHentOppgaver';
import { IkkeFortroligEnhet } from '../../Oppgavebenk/typer/enhet';
import { ModalOpprettOgFerdigstilleOppgaver } from './ModalOpprettOgFerdigstilleOppgaver';

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
}

const SendTilBeslutterFooter: React.FC<{
    behandling: Behandling;
    kanSendesTilBeslutter?: boolean;
    behandlingErRedigerbar: boolean;
    ferdigstillUtenBeslutter: boolean;
    oppgaverForOpprettelse?: IOppgaverForOpprettelse;
}> = ({
    behandling,
    kanSendesTilBeslutter,
    behandlingErRedigerbar,
    ferdigstillUtenBeslutter,
    oppgaverForOpprettelse,
}) => {
    const { axiosRequest, personIdent } = useApp();
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
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [visMarkereGodkjenneVedtakOppgaveModal, settVisMarkereGodkjenneVedtakOppgaveModal] =
        useState<boolean>(false);
    const { hentOppgaver, oppgaver: fremleggsOppgaver } = useHentOppgaver();
    const [sendTilBeslutterRequest, settSendTilBeslutterRequest] =
        useState<SendTilBeslutterRequest>({
            oppgavetyperSomSkalOpprettes:
                oppgaverForOpprettelse?.oppgavetyperSomSkalOpprettes ?? [],
        });

    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, SendTilBeslutterRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/send-til-beslutter`,
            data: {
                oppgavetyperSomSkalOpprettes: sendTilBeslutterRequest.oppgavetyperSomSkalOpprettes,
                årForInntektskontrollSelvstendigNæringsdrivende:
                    sendTilBeslutterRequest.årForInntektskontrollSelvstendigNæringsdrivende,
            },
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    hentVedtak.rerun();
                    hentAnsvarligSaksbehandler.rerun();
                    hentTotrinnskontroll.rerun();
                    settVisMarkereGodkjenneVedtakOppgaveModal(false);
                    settVisModal(true);
                    oppgaverForOpprettelse?.hentOppgaverForOpprettelse(behandling.id);
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

    useEffect(() => {
        const fetchOppgaver = () => {
            if (!personIdent) return;
            hentOppgaver({
                ident: personIdent,
                oppgavetype: 'FREM',
                enhet: IkkeFortroligEnhet.NAY,
                behandlingstema: 'ab0071',
            });
        };
        fetchOppgaver();
    }, [hentOppgaver, personIdent]);

    const skalViseKnappForModal =
        toggleVisKnappForModal &&
        oppgaverForOpprettelse &&
        oppgaverForOpprettelse.oppgavetyperSomKanOpprettes.length > 0;

    return (
        <>
            {behandlingErRedigerbar && (
                <Footer>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    {ferdigstillUtenBeslutter && (
                        <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                    )}
                    <FlexBox>
                        {oppgaverForOpprettelse && (
                            <OppgaverForOpprettelse
                                behandling={behandling}
                                oppgaverForOpprettelse={oppgaverForOpprettelse}
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
                                disabled={
                                    laster ||
                                    !kanSendesTilBeslutter ||
                                    harVerdi(oppgaverForOpprettelse?.feilmelding)
                                }
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
            {toggleVisKnappForModal && fremleggsOppgaver && (
                <ModalOpprettOgFerdigstilleOppgaver
                    open={visMarkereGodkjenneVedtakOppgaveModal}
                    setOpen={settVisMarkereGodkjenneVedtakOppgaveModal}
                    oppgaverForOpprettelse={oppgaverForOpprettelse}
                    sendTilBeslutterRequest={sendTilBeslutterRequest}
                    settSendTilBeslutterRequest={settSendTilBeslutterRequest}
                    sendTilBeslutter={sendTilBeslutter}
                    fremleggsOppgaver={fremleggsOppgaver}
                />
            )}
        </>
    );
};

export default SendTilBeslutterFooter;
