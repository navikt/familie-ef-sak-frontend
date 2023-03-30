import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
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
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import FremleggsoppgaveInntekt from './Fremleggsoppgave';

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

export enum FremleggsoppgaveType {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID = 'INNTEKTSKONTROLL_1_ÅR_FREM_I_TID',
}

export interface FremleggWrapper {
    oppgavetyperSomKanOpprettes: FremleggsoppgaveType[];
    oppgavetyperSomSkalOpprettes: FremleggsoppgaveType[];
    opprettelseTattStillingTil: boolean;
}

export const fremleggOppgaveTilTekst: Record<FremleggsoppgaveType, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID: 'Oppgave for inntektskontroll, 1 år frem i tid',
};

const tomFremleggWrapper: FremleggWrapper = {
    oppgavetyperSomSkalOpprettes: [],
    oppgavetyperSomKanOpprettes: [],
    opprettelseTattStillingTil: false,
};

const SendTilBeslutterFooter: React.FC<{
    behandlingId: string;
    kanSendesTilBeslutter?: boolean;
    behandlingErRedigerbar?: boolean;
    ferdigstillUtenBeslutter: boolean;
}> = ({
    behandlingId,
    kanSendesTilBeslutter,
    behandlingErRedigerbar,
    ferdigstillUtenBeslutter,
}) => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    const { behandlingstype, hentTotrinnskontroll, hentBehandling, hentBehandlingshistorikk } =
        useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [fremleggWrapper, settFremleggWrapper] = useState<FremleggWrapper>(tomFremleggWrapper);

    const initierFremlegWrapper = (fremleggWrapper: FremleggWrapper) => {
        if (fremleggWrapper.opprettelseTattStillingTil) {
            settFremleggWrapper(fremleggWrapper);
        } else {
            settFremleggWrapper({
                ...fremleggWrapper,
                oppgavetyperSomSkalOpprettes: fremleggWrapper.oppgavetyperSomKanOpprettes,
            });
        }
    };

    const sjekkOmFremleggKanOpprettes = useCallback(() => {
        if (behandlingstype === Behandlingstype.FØRSTEGANGSBEHANDLING) {
            axiosRequest<FremleggWrapper, undefined>({
                method: 'GET',
                url: `/familie-ef-sak/api/fremleggsoppgave/${behandlingId}`,
            }).then((res: RessursSuksess<FremleggWrapper> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    initierFremlegWrapper(res.data);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        }
    }, [axiosRequest, behandlingId, behandlingstype]);

    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, FremleggWrapper>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
            data: { ...fremleggWrapper, opprettelseTattStillingTil: true },
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

    useEffect(() => {
        sjekkOmFremleggKanOpprettes();
    }, [sjekkOmFremleggKanOpprettes]);

    const håndterCheckboxEndring = (oppgavetype: FremleggsoppgaveType) => {
        if (fremleggWrapper.oppgavetyperSomSkalOpprettes.includes(oppgavetype)) {
            settFremleggWrapper((prevState) => ({
                ...prevState,
                oppgavetyperSomSkalOpprettes: prevState.oppgavetyperSomSkalOpprettes.filter(
                    (prevOppgavetype) => prevOppgavetype != oppgavetype
                ),
            }));
        } else {
            settFremleggWrapper((prevState) => ({
                ...prevState,
                oppgavetyperSomSkalOpprettes: [
                    ...prevState.oppgavetyperSomSkalOpprettes,
                    oppgavetype,
                ],
            }));
        }
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
            {(behandlingErRedigerbar || fremleggWrapper.oppgavetyperSomKanOpprettes.length > 0) && (
                <Footer>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    {ferdigstillUtenBeslutter && (
                        <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                    )}
                    <FremleggsoppgaveInntekt
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        fremleggWrapper={fremleggWrapper}
                        håndterCheckboxEndring={håndterCheckboxEndring}
                    />
                    {behandlingErRedigerbar && (
                        <MidtstiltInnhold>
                            <HovedKnapp
                                onClick={sendTilBeslutter}
                                disabled={laster || !kanSendesTilBeslutter}
                                type={'button'}
                            >
                                {ferdigstillTittel}
                            </HovedKnapp>
                        </MidtstiltInnhold>
                    )}
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
        </>
    );
};

export default SendTilBeslutterFooter;
