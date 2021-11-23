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

const Footer = styled.footer`
    width: calc(100%);
    position: fixed;
    bottom: 0;
    background-color: ${navFarger.navGra80};
`;

const MidtstiltInnhold = styled.div`
    width: 30%;
    margin: 0 auto;
    display: flex;
`;

const StyledHovedknapp = styled(Hovedknapp)`
    margin-left: 1rem;
    margin-right: 1rem;
`;

const SendTilBeslutterFooter: React.FC<{
    behandlingId: string;
    kanSendesTilBeslutter?: boolean;
}> = ({ behandlingId, kanSendesTilBeslutter }) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentTotrinnskontroll } = useBehandling();
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
            <Footer>
                {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                <MidtstiltInnhold>
                    <StyledHovedknapp
                        onClick={sendTilBeslutter}
                        disabled={laster || kanSendesTilBeslutter === false}
                    >
                        Send til beslutter
                    </StyledHovedknapp>
                </MidtstiltInnhold>
            </Footer>
        </>
    );
};

export default SendTilBeslutterFooter;
