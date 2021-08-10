import constate from 'constate';
import { useReducer } from 'react';
import { OrNothing } from '../hooks/felles/useSorteringState';

export enum ModalType {
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    VEDTAK_GODKJENT = 'VEDTAK_GODKJENT',
    BEHANDLES_I_GOSYS = 'BEHANDLES_I_GOSYS',
}

export enum ModalAction {
    VIS_MODAL = 'VIS_MODAL',
    SKJUL_MODAL = 'SKJUL_MODAL',
}

type VisModalAction = {
    type: ModalAction.VIS_MODAL;
    modalType: ModalType;
};

type SkjulModal = { type: ModalAction.SKJUL_MODAL };

type ModalActions = VisModalAction | SkjulModal;

interface ModalState {
    modalType: OrNothing<ModalType>;
}

const modalReducer = (state: ModalState, action: ModalActions): ModalState => {
    switch (action.type) {
        case ModalAction.VIS_MODAL:
            return { ...state, modalType: action.modalType };
        case ModalAction.SKJUL_MODAL:
            return { ...state, modalType: null };
        default:
            return state;
    }
};

const initialState = {
    modalType: null,
};

const [ModalProvider, useModal] = constate(() => {
    const [modalState, modalDispatch] = useReducer(modalReducer, initialState);

    return {
        modalState,
        modalDispatch,
    };
});

export { ModalProvider, useModal };
