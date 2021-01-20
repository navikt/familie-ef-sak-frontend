import constate from 'constate';
import { useState } from 'react';

export enum ModalTyper {
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
}

const [ModalProvider, useModalProvider] = constate(() => {
    const [modalType, settModalType] = useState(null);
    const [erSynlig, settErSynlig] = useState(false);

    const skjulModal = () => {
        settErSynlig(false);
    };

    const visModal = () => {
        settErSynlig(true);
    };

    return {
        erSynlig,
        visModal,
        skjulModal,
        modalType,
        settModalType,
    };
});

export { ModalProvider, useModalProvider };
