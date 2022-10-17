import * as React from 'react';
import { useState } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

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
    behandlingErRedigerbar?: boolean;
}> = ({ behandlingId, kanSendesTilBeslutter, behandlingErRedigerbar }) => {
    const { axiosRequest, gåTilUrl } = useApp();
    const { hentTotrinnskontroll, hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);

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

    const lukkModal = () => {
        settVisModal(false);
        hentBehandling.rerun();
        hentBehandlingshistorikk.rerun();
    };

    return (
        <>
            {behandlingErRedigerbar && (
                <Footer>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                    <MidtstiltInnhold>
                        <StyledHovedknapp
                            onClick={sendTilBeslutter}
                            disabled={laster || !kanSendesTilBeslutter}
                        >
                            Send til beslutter
                        </StyledHovedknapp>
                    </MidtstiltInnhold>
                </Footer>
            )}
            <ModalWrapper
                tittel={'Vedtaket er sendt til beslutter'}
                visModal={visModal}
                onClose={() => settVisModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => gåTilUrl('/oppgavebenk'),
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
