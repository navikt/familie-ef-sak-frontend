import * as React from 'react';
import { useState } from 'react';
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
import OppgaverForOpprettelse, { OppgaveForOpprettelseType } from './OppgaverForOpprettelse';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';

const Footer = styled.footer`
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: ${ABorderStrong};
`;

const MidtstiltInnhold = styled.div`
    width: 30%;
    margin: 0 auto;
    display: flex;
`;

const HovedKnapp = styled(Button)`
    margin-left: 1rem;
    margin-right: 1rem;
`;

export interface SendTilBeslutterRequest {
    oppgavetyperSomSkalOpprettes: OppgaveForOpprettelseType[];
}

const SendTilBeslutterFooter: React.FC<{
    behandling: Behandling;
    kanSendesTilBeslutter?: boolean;
    behandlingErRedigerbar: boolean;
    ferdigstillUtenBeslutter: boolean;
}> = ({ behandling, kanSendesTilBeslutter, behandlingErRedigerbar, ferdigstillUtenBeslutter }) => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    const { hentTotrinnskontroll, hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const oppgaverForOpprettelseState = useHentOppgaverForOpprettelse();
    const behandlingId = behandling.id;

    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, SendTilBeslutterRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
            data: {
                oppgavetyperSomSkalOpprettes:
                    oppgaverForOpprettelseState.oppgaverForOpprettelse.oppgavetyperSomSkalOpprettes,
            },
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    hentTotrinnskontroll.rerun();
                    settVisModal(true);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
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

    return (
        <>
            <Footer>
                {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                {ferdigstillUtenBeslutter && (
                    <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                )}
                <OppgaverForOpprettelse
                    behandling={behandling}
                    behandlingErRedigerbar={behandlingErRedigerbar}
                    oppgaverForOpprettelseState={oppgaverForOpprettelseState}
                />
                {behandlingErRedigerbar && (
                    <MidtstiltInnhold>
                        <HovedKnapp
                            onClick={sendTilBeslutter}
                            disabled={
                                laster ||
                                !kanSendesTilBeslutter ||
                                oppgaverForOpprettelseState.feilmelding
                            }
                            type={'button'}
                        >
                            {ferdigstillTittel}
                        </HovedKnapp>
                    </MidtstiltInnhold>
                )}
            </Footer>
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
        </>
    );
};

export default SendTilBeslutterFooter;
