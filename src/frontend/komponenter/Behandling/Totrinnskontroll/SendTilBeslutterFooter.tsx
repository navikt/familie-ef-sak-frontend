import * as React from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { useApp } from '../../../context/AppContext';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useState } from 'react';
import UIModalWrapper from '../../Felleskomponenter/Modal/UIModalWrapper';

const Footer = styled.footer`
    width: calc(100% - 571px);
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

const StyledKnapp = styled(Knapp)`
    margin-left: 1rem;
    margin-right: 1rem;
    box-shadow: none;
    transform: none;
`;

const SendTilBeslutterFooter: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentTotrinnskontroll } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [simuleringsdata, settSimuleringsdata] = useState<string | null>();

    const sendTilBeslutter = () => {
        settLaster(true);
        axiosRequest<string, undefined>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
        })
            .then((res: Ressurs<string>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentTotrinnskontroll.rerun();
                    modalDispatch({
                        type: ModalAction.VIS_MODAL,
                        modalType: ModalType.SENDT_TIL_BESLUTTER,
                    });
                } else {
                    window.alert('Det gikk mindre bra! :(((');
                }
            })
            .finally(() => settLaster(false));
    };

    const kjørSimulering = () => {
        settLaster(true);
        axiosRequest<string, undefined>({
            method: 'GET',
            url: `/familie-ef-sak/api/simulering/${behandlingId}`,
        })
            .then((res: Ressurs<string>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settSimuleringsdata(res.data);
                } else {
                    window.alert('Simulering feilet');
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <Footer>
            <UIModalWrapper
                modal={{
                    tittel: 'Simulering',
                    lukkKnapp: true,
                    visModal: !!simuleringsdata,
                    onClose: () => settSimuleringsdata(null),
                }}
            >
                <pre>{JSON.stringify(simuleringsdata, null, 2)}</pre>
            </UIModalWrapper>
            <MidtstiltInnhold>
                <StyledKnapp>Lagre</StyledKnapp>
                <StyledHovedknapp onClick={sendTilBeslutter} disabled={laster}>
                    Send til beslutter
                </StyledHovedknapp>
                <StyledKnapp onClick={kjørSimulering}>Simulér</StyledKnapp>
            </MidtstiltInnhold>
        </Footer>
    );
};

export default SendTilBeslutterFooter;
