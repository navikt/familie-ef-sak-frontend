import { Hovedknapp as HovedknappNAV } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { ModalAction, ModalType, useModal } from '../../../../App/context/ModalContext';
import { useApp } from '../../../../App/context/AppContext';
import styled from 'styled-components';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import hiddenIf from '../../../../Felles/HiddenIf/hiddenIf';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';

const Hovedknapp = hiddenIf(HovedknappNAV);
const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

export const BehandleIGosys: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest, nullstillIkkePersisterteKomponenter } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const { modalDispatch } = useModal();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const behandleIGosys = () => {
        settLaster(true);
        axiosRequest<{ id: string }, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/henlegg`,
        })
            .then((res: Ressurs<{ id: string }>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        modalDispatch({
                            type: ModalAction.VIS_MODAL,
                            modalType: ModalType.BEHANDLES_I_GOSYS,
                        });
                        nullstillIkkePersisterteKomponenter();
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
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
        </>
    );
};
