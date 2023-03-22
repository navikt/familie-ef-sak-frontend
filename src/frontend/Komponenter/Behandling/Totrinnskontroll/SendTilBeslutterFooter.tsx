import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Alert, Button, Checkbox } from '@navikt/ds-react';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { useNavigate } from 'react-router-dom';

const Footer = styled.footer`
    width: calc(100%);
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

const Alertstripe = styled(Alert)`
    white-space: nowrap;
`;

export interface IFremleggsOppgave {
    kanOppretteFremleggsoppgave: boolean;
    skalOppretteFremleggsoppgave?: boolean;
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
    const { hentTotrinnskontroll, hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [kanOppretteFremleggsoppgave, setKanOppretteFremleggsoppgave] = useState<boolean>(false);
    const [skalOppretteFremleggsoppgave, setSkalOppretteFremleggsoppgave] =
        useState<boolean>(false);

    const opprettFremleggsoppgaveOgSendTilBeslutter = () => {
        axiosRequest<void, undefined>({
            method: 'POST',
            url: `/familie-ef-sak/api/fremleggsoppgave/${behandlingId}/inntekt/${skalOppretteFremleggsoppgave}`,
        }).then((res: RessursSuksess<void> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                sendTilBeslutter();
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };
    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, undefined>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
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

    const checkBoxEndring = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSkalOppretteFremleggsoppgave(event.target.checked);
    };

    useEffect(() => {
        axiosRequest<IFremleggsOppgave, undefined>({
            method: 'GET',
            url: `/familie-ef-sak/api/fremleggsoppgave/${behandlingId}`,
        }).then((res: RessursSuksess<IFremleggsOppgave> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                if (res.data.skalOppretteFremleggsoppgave != null) {
                    setSkalOppretteFremleggsoppgave(res.data.skalOppretteFremleggsoppgave);
                }
                setKanOppretteFremleggsoppgave(res.data.kanOppretteFremleggsoppgave);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    }, [axiosRequest, behandlingId]);
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
                    {kanOppretteFremleggsoppgave && (
                        <Alertstripe variant={'info'} fullWidth={true}>
                            <b>
                                Følgende oppgaver skal opprettes automatisk ved godkjenning av dette
                                vedtaket:
                            </b>
                            <Checkbox
                                onChange={checkBoxEndring}
                                checked={skalOppretteFremleggsoppgave}
                            >
                                Oppgave for kontroll av inntekt 1 år frem i tid
                            </Checkbox>
                        </Alertstripe>
                    )}
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    {ferdigstillUtenBeslutter && (
                        <AlertInfo>Vedtaket vil ikke bli sendt til totrinnskontroll</AlertInfo>
                    )}
                    <MidtstiltInnhold>
                        <HovedKnapp
                            onClick={opprettFremleggsoppgaveOgSendTilBeslutter}
                            disabled={laster || !kanSendesTilBeslutter}
                            type={'button'}
                        >
                            {ferdigstillTittel}
                        </HovedKnapp>
                    </MidtstiltInnhold>
                </Footer>
            )}
            {!behandlingErRedigerbar && skalOppretteFremleggsoppgave && (
                <Alertstripe variant={'info'} fullWidth={true}>
                    <b>
                        Følgende oppgaver skal opprettes automatisk ved godkjenning av dette
                        vedtaket:
                    </b>
                    <li>Oppgave for kontroll av inntekt 1 år frem i tid</li>
                </Alertstripe>
            )}
            {!behandlingErRedigerbar && !skalOppretteFremleggsoppgave && (
                <Alertstripe variant={'info'} fullWidth={true}>
                    <b>
                        Følgende oppgaver skal opprettes automatisk ved godkjenning av dette
                        vedtaket:
                    </b>
                    <br />
                    <i>Ingen oppgave opprettes automatisk</i>
                </Alertstripe>
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
