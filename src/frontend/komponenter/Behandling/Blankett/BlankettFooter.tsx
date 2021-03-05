import * as React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { useApp } from '../../../context/AppContext';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import { useBehandling } from '../../../context/BehandlingContext';

const Footer = styled.div`
    width: calc(100% - 475px);
    position: fixed;
    bottom: 0;
    background-color: ${navFarger.navGra80};
`;

const MittstildtInnhold = styled.div`
    width: 30%;
    margin: 0 auto;
    display: flex;
`;

const StyledHovedknapp = styled(Hovedknapp)`
    margin-left: 2rem;
    box-shadow: none;
    transform: none;
`;

const BlankettFooter: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentTotrinnskontroll } = useBehandling();

    const sendTilBeslutter = () =>
        axiosRequest<string, undefined>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
        }).then((res: Ressurs<string>) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentTotrinnskontroll.rerun();
                modalDispatch({
                    type: ModalAction.VIS_MODAL,
                    modalType: ModalType.SENDT_TIL_BESLUTTER,
                });
            } else {
                window.alert('Det gikk mindre bra! :(((');
            }
        });

    return (
        <Footer>
            <MittstildtInnhold>
                <StyledHovedknapp onClick={sendTilBeslutter}>Send til beslutter</StyledHovedknapp>
            </MittstildtInnhold>
        </Footer>
    );
};

export default BlankettFooter;
