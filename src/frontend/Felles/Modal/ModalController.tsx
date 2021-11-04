import React from 'react';
import { ModalAction, ModalType, useModal } from '../../App/context/ModalContext';
import UIModalWrapper from './UIModalWrapper';
import { Knapp } from 'nav-frontend-knapper';
import { useBehandling } from '../../App/context/BehandlingContext';
import { useApp } from '../../App/context/AppContext';

const modalTittelToTekst: Record<ModalType, string> = {
    SENDT_TIL_BESLUTTER: 'Vedtaket er sendt til beslutter',
    VEDTAK_GODKJENT: 'Vedtaket er godkjent',
    VEDTAK_UNDERKJENT: 'Vedtaket er underkjent',
    BEHANDLES_I_GOSYS: 'Saken er avsluttet og må behandles i Gosys',
};

const ModalController: React.FC = () => {
    const { modalState, modalDispatch } = useModal();
    const { hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const { gåTilUrl } = useApp();

    switch (modalState.modalType) {
        case ModalType.SENDT_TIL_BESLUTTER:
        case ModalType.VEDTAK_GODKJENT:
        case ModalType.VEDTAK_UNDERKJENT:
            return (
                <UIModalWrapper
                    modal={{
                        tittel: `${modalTittelToTekst[modalState.modalType]}`,
                        lukkKnapp: true,
                        visModal:
                            modalState.modalType === ModalType.SENDT_TIL_BESLUTTER ||
                            modalState.modalType === ModalType.VEDTAK_GODKJENT ||
                            modalState.modalType === ModalType.VEDTAK_UNDERKJENT,
                        onClose: () => modalDispatch({ type: ModalAction.SKJUL_MODAL }),
                        actions: [
                            <Knapp
                                key={'lukk modal'}
                                mini={true}
                                onClick={() => {
                                    modalDispatch({ type: ModalAction.SKJUL_MODAL });
                                    hentBehandling.rerun();
                                    hentBehandlingshistorikk.rerun();
                                }}
                                children="Lukk"
                            />,
                            <Knapp
                                key={'oppgavebenk'}
                                type={'hoved'}
                                mini={true}
                                onClick={() => gåTilUrl('/oppgavebenk')}
                                children="Til oppgavebenk"
                            />,
                        ],
                    }}
                />
            );
        case ModalType.BEHANDLES_I_GOSYS:
            return (
                <UIModalWrapper
                    modal={{
                        tittel: `${modalTittelToTekst[ModalType.BEHANDLES_I_GOSYS]}`,
                        lukkKnapp: false,
                        visModal: modalState.modalType === ModalType.BEHANDLES_I_GOSYS,
                        actions: [
                            <Knapp
                                key={'oppgavebenk'}
                                type={'hoved'}
                                mini={true}
                                onClick={() => gåTilUrl('/oppgavebenk')}
                                children="Til oppgavebenk"
                            />,
                        ],
                    }}
                />
            );
        default:
            return null;
    }
};

export default ModalController;
