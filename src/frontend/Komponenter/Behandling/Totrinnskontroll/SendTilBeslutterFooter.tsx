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
import { useHentOppgaver } from '../../../App/hooks/useHentOppgaver';
import { IkkeFortroligEnhet } from '../../Oppgavebenk/typer/enhet';
import { ModalOpprettOgFerdigstilleOppgaver } from './ModalOpprettOgFerdigstilleOppgaver';
import { OppgaverForOpprettelseRequest } from '../../../App/hooks/useHentOppgaverForOpprettelse';

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
    oppgaverForOpprettelse?: OppgaverForOpprettelseRequest;
    settHentPåNytt?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    behandling,
    kanSendesTilBeslutter,
    behandlingErRedigerbar,
    ferdigstillUtenBeslutter,
    oppgavetyperSomKanOpprettes,
    settHentPåNytt,
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
    const [oppgavetyperSomSkalOpprettes, settOppgavetyperSomSkalOpprettes] = useState<
        OppgaveTypeForOpprettelse[]
    >(utledDefaultOppgavetyperSomSkalOpprettes(oppgavetyperSomKanOpprettes));
    const [
        årForInntektskontrollSelvstendigNæringsdrivende,
        settÅrForInntektskontrollSelvstendigNæringsdrivende,
    ] = useState<number | undefined>();

    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        if (settHentPåNytt) {
            settHentPåNytt(false);
        }
        axiosRequest<string, SendTilBeslutterRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/send-til-beslutter`,
            data: {
                oppgavetyperSomSkalOpprettes: oppgavetyperSomSkalOpprettes,
                årForInntektskontrollSelvstendigNæringsdrivende:
                    årForInntektskontrollSelvstendigNæringsdrivende,
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
                    if (settHentPåNytt) {
                        settHentPåNytt(true);
                    }
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
        oppgavetyperSomKanOpprettes &&
        oppgavetyperSomKanOpprettes.length > 0;

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
            {toggleVisKnappForModal && fremleggsOppgaver && (
                <ModalOpprettOgFerdigstilleOppgaver
                    open={visMarkereGodkjenneVedtakOppgaveModal}
                    setOpen={settVisMarkereGodkjenneVedtakOppgaveModal}
                    sendTilBeslutter={sendTilBeslutter}
                    fremleggsOppgaver={fremleggsOppgaver}
                    oppgavetyperSomKanOpprettes={oppgavetyperSomKanOpprettes}
                    oppgavetyperSomSkalOpprettes={oppgavetyperSomSkalOpprettes}
                    settOppgavetyperSomSkalOpprettes={settOppgavetyperSomSkalOpprettes}
                    årForInntektskontrollSelvstendigNæringsdrivende={
                        årForInntektskontrollSelvstendigNæringsdrivende
                    }
                    settÅrForInntektskontrollSelvstendigNæringsdrivende={
                        settÅrForInntektskontrollSelvstendigNæringsdrivende
                    }
                />
            )}
        </>
    );
};

export default SendTilBeslutterFooter;
