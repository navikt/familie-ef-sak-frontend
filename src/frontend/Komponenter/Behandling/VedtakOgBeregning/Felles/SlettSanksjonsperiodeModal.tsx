import React from 'react';
import { ModalWrapper } from '../../../../Felles/Modal/ModalWrapper';
import { formaterIsoMånedÅrFull } from '../../../../App/utils/formatter';

export type Sanksjonsmodal =
    | { visModal: false }
    | { visModal: true; index: number; årMånedFra: string };

export const SlettSanksjonsperiodeModal: React.FC<{
    sanksjonsmodal: Sanksjonsmodal;
    slettPeriode: (index: number) => void;
    lukkModal: () => void;
}> = ({ sanksjonsmodal, slettPeriode, lukkModal }) => {
    if (!sanksjonsmodal.visModal) {
        return null;
    }
    return (
        <ModalWrapper
            tittel={'Vil du oppheve sanksjon'}
            visModal={true}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => slettPeriode(sanksjonsmodal.index),
                    tekst: 'Fjern sanksjon',
                },
                lukkKnapp: {
                    onClick: lukkModal,
                    tekst: 'Avbryt',
                },
            }}
            onClose={lukkModal}
        >
            Du er i ferd med å fjerne en periode bruker er ilagt sanksjon (
            {formaterIsoMånedÅrFull(sanksjonsmodal.årMånedFra)}
            ). Er du sikker på at du vil gjøre dette?
        </ModalWrapper>
    );
};
