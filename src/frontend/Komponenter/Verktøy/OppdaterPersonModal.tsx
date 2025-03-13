import React, { FC } from 'react';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { SøkPerson } from '../Behandling/Brevmottakere/SøkPerson';
import styled from 'styled-components';

const InnerContainer = styled.div`
    margin-top: 1rem;
    margin-bottom: 2rem;
`;

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
            <InnerContainer>
                <SøkPerson
                    oppdaterPerson={(personIdent: string, navn: string) => {
                        oppdaterPerson(personIdent, navn);
                        lukkModal();
                    }}
                />
            </InnerContainer>
        </ModalWrapper>
    );
};
