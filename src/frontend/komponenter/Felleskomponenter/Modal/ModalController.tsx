import React from 'react';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import UIModalWrapper from './UIModalWrapper';
import { Knapp } from 'nav-frontend-knapper';
import { useHistory } from 'react-router-dom';

const modalTittelToTekst = {
    SENDT_TIL_BESLUTTER: 'Vedtaket er sendt til beslutter',
    VEDTAK_GODKJENT: 'Vedtaker er godkjent',
    VEDTAK_UNDERKJENT: 'Vedtaker er undergodkjent',
};

const ModalController: React.FC = () => {
    const { modalState, modalDispatch } = useModal();
    const history = useHistory();

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
                                onClick={() => modalDispatch({ type: ModalAction.SKJUL_MODAL })}
                                children="Lukk"
                            />,
                            <Knapp
                                key={'opgavebenk'}
                                type={'hoved'}
                                mini={true}
                                onClick={() => history.push('/oppgavebenk')}
                                children="Til opgavebenk"
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
