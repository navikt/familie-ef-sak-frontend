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

export interface IFremleggsoppgave {
    kanOppretteFremleggsoppgave: boolean;
    oppgavetyper: FremleggsoppgaveType[];
}

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
    const [kanOppretteFremlegg, settKanOppretteFremlegg] = useState<boolean>(false);
    const [skalOppretteFremleggsoppgave, settSkalOppretteFremleggsoppgave] = useState<
        FremleggsoppgaveType[]
    >(Object.values(FremleggsoppgaveType));
    const erFørstegangsbehandling = behandlingstype === Behandlingstype.FØRSTEGANGSBEHANDLING;

    const sjekkOmFremleggKanOpprettes = useCallback(() => {
        if (erFørstegangsbehandling) {
            axiosRequest<IFremleggsOppgave, undefined>({
                method: 'GET',
                url: `/familie-ef-sak/api/fremleggsoppgave/${behandlingId}`,
            }).then((res: RessursSuksess<IFremleggsOppgave> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    if (res.data.oppgavetyper !== null) {
                        settSkalOppretteFremleggsoppgave(res.data.oppgavetyper);
                    }
                    settKanOppretteFremlegg(res.data.kanOppretteFremleggsoppgave);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        }
    }, [axiosRequest, behandlingId, erFørstegangsbehandling]);

    const sendTilBeslutter = () => {
        const fremleggsOppgave: IFremleggsOppgave = {
            kanOppretteFremleggsoppgave: kanOppretteFremlegg,
            oppgavetyper: skalOppretteFremleggsoppgave,
        };
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, IFremleggsOppgave>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
            data: fremleggsOppgave,
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
        if (skalOppretteFremleggsoppgave.includes(oppgavetype)) {
            settSkalOppretteFremleggsoppgave(
                skalOppretteFremleggsoppgave.filter((str) => str !== oppgavetype)
            );
        } else {
            const updatedArray = [...skalOppretteFremleggsoppgave, oppgavetype];
            settSkalOppretteFremleggsoppgave(updatedArray);
        }
    };
    const håndterCheckboxEndringInntekt = () => {
        håndterCheckboxEndring(FremleggsoppgaveType.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID);
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
            {behandlingErRedigerbar && (
                <Footer>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    {ferdigstillUtenBeslutter && (
                        <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                    )}
                    {erFørstegangsbehandling && (
                        <FremleggsoppgaveInntekt
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            håndterCheckboxEndring={håndterCheckboxEndringInntekt}
                            kanOppretteFremlegg={kanOppretteFremlegg}
                            skalOppretteFremlegg={skalOppretteFremleggsoppgave.includes(
                                FremleggsoppgaveType.INNTEKTSKONTROLL_1_ÅR_FREM_I_TID
                            )}
                        />
                    )}
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
