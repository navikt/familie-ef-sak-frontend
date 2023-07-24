import React, { FC } from 'react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

export const TaAvVentBekreftModal: FC<{
    håndterFortsettBehandling: () => void;
    avbryt: () => void;
    ansvarligSaksbehandler: string;
    visModal: boolean;
}> = ({ håndterFortsettBehandling, avbryt, ansvarligSaksbehandler, visModal }) => {
    return (
        <ModalWrapper
            tittel={'Ta av vent'}
            visModal={visModal}
            onClose={avbryt}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: håndterFortsettBehandling,
                    tekst: 'Ta av vent',
                },
                lukkKnapp: {
                    onClick: avbryt,
                    tekst: 'Avbryt',
                },
            }}
            ariaLabel={'Ta av vent'}
        >
            {ansvarligSaksbehandler} står som ansvarlig saksbehandler på denne oppgaven. Hvis du tar
            den av vent blir du satt som ansvarlig saksbehandler
        </ModalWrapper>
    );
};
