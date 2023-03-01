import React from 'react';

type ModalContext = {
    visNullstillVedtakModal: boolean;
    settVisNullstillVedtakModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export const NullstillVedtakModalContext = React.createContext({} as unknown as ModalContext);
