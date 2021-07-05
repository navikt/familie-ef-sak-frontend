import { Hovedknapp as HovedknappNAV } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import hiddenIf from '../../../Felleskomponenter/HiddenIf/hiddenIf';
import { useBehandling } from '../../../context/BehandlingContext';

const Hovedknapp = hiddenIf(HovedknappNAV);
const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

export const BehandleIGosys: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const { modalDispatch } = useModal();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const behandleIGosys = () => {
        settLaster(true);
        axiosRequest<{ id: string }, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/annuller`,
        })
            .then((res: Ressurs<{ id: string }>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        modalDispatch({
                            type: ModalAction.VIS_MODAL,
                            modalType: ModalType.BEHANDLES_I_GOSYS,
                        });
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };

    return (
        <>
            <StyledAdvarsel>Oppgaven annulleres og må fullføres i Gosys</StyledAdvarsel>
            <Hovedknapp
                hidden={!behandlingErRedigerbar}
                style={{ marginTop: '2rem' }}
                onClick={behandleIGosys}
                disabled={laster}
            >
                Avslutt og behandle i Gosys
            </Hovedknapp>
            {feilmelding && (
                <AlertStripeFeil style={{ marginTop: '2rem' }}>{feilmelding}</AlertStripeFeil>
            )}
        </>
    );
};
