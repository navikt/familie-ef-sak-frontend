import React, { FC } from 'react';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { SøkPerson } from '../Behandling/Brevmottakere/SøkPerson';

export const OppdaterPersonModal: FC<{
    oppdaterPerson: (personIdent: string, navn: string) => void;
    lukkModal: () => void;
}> = ({ lukkModal, oppdaterPerson }) => {
    return (
        <ModalWrapper
            tittel={'Velg person'}
            visModal={true}
            onClose={lukkModal}
            maxWidth={40}
            ariaLabel={'Velg person'}
        >
            <SøkPerson
                oppdaterPerson={(personIdent: string, navn: string) => {
                    oppdaterPerson(personIdent, navn);
                    lukkModal();
                }}
            />
        </ModalWrapper>
    );
};
