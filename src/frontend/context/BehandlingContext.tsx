import constate from 'constate';
import { useState } from 'react';

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
