import * as React from 'react';
import { useState } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { ModalAction, ModalType, useModal } from '../../../App/context/ModalContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { SendTilBeslutterFooterVerge } from './SendTilBeslutterFooterVerge';

export const Footer = styled.footer`
    width: calc(100%);
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: ${navFarger.navGra80};
`;

export const MidtstiltInnhold = styled.div`
    display: flex;
    padding: 1rem;
    align-items: center;
    margin: 0 auto;
    color: white;
`;

export const StyledHovedknapp = styled(Hovedknapp)`
    margin-left: 1rem;
    margin-right: 1rem;
`;

const SendTilBeslutterFooter: React.FC<{
    behandlingId: string;
    kanSendesTilBeslutter?: boolean;
}> = ({ behandlingId, kanSendesTilBeslutter }) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentTotrinnskontroll, personopplysningerResponse } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        axiosRequest<string, undefined>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentTotrinnskontroll.rerun();
                    modalDispatch({
                        type: ModalAction.VIS_MODAL,
                        modalType: ModalType.SENDT_TIL_BESLUTTER,
                    });
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <>
            <DataViewer response={{ personopplysningerResponse }}>
                {({ personopplysningerResponse }) => {
                    const harVerge = personopplysningerResponse.vergemål.length !== 0;
                    return harVerge ? (
                        <SendTilBeslutterFooterVerge
                            behandlingId={behandlingId}
                            personopplysninger={personopplysningerResponse}
                        />
                    ) : (
                        <Footer>
                            {feilmelding && (
                                <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>
                            )}
                            <MidtstiltInnhold>
                                <StyledHovedknapp
                                    onClick={sendTilBeslutter}
                                    disabled={laster || kanSendesTilBeslutter === false}
                                >
                                    Send til beslutter
                                </StyledHovedknapp>
                            </MidtstiltInnhold>
                        </Footer>
                    );
                }}
            </DataViewer>
        </>
    );
};

export default SendTilBeslutterFooter;
