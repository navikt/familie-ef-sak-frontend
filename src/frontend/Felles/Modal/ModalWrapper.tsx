import styled from 'styled-components';
import { Button, Heading, Modal } from '@navikt/ds-react';
import React from 'react';

const ModalContainer = styled(Modal)`
    min-width: 30rem;
    max-width: 40rem;
`;

const Tittel = styled(Heading)`
    margin-top: 0.5rem;
    margin-right: 3.5rem;
    margin-left: 2rem;
`;

const Innhold = styled.div`
    margin-right: 2rem;
    margin-left: 2rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 4rem;
    margin-right: 2rem;
    margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-left: 1rem;
`;

interface ModalProps {
    tittel: string;
    visModal: boolean;
    onClose: () => void;
    hovedKnappClick?: () => void;
    lukkKnappDisabled?: boolean;
    hovedKnappDisabled?: boolean;
    lukkKnappTekst?: string;
    hovedKnappTekst?: string;
    skjulKnapper?: boolean;
    ariaLabel?: string;
    children?: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalProps> = ({
    tittel,
    visModal,
    onClose,
    hovedKnappClick,
    lukkKnappDisabled,
    hovedKnappDisabled,
    lukkKnappTekst,
    hovedKnappTekst,
    skjulKnapper,
    ariaLabel,
    children,
}) => {
    return (
        <ModalContainer
            open={visModal}
            aria-label={ariaLabel ? ariaLabel : tittel}
            onClose={() => onClose()}
        >
            <Modal.Content>
                <Tittel spacing={true} size={'medium'}>
                    {tittel}
                </Tittel>
                <Innhold>{children}</Innhold>
                {!skjulKnapper && (
                    <ButtonContainer>
                        <ModalKnapp
                            variant="tertiary"
                            onClick={() => onClose()}
                            disabled={lukkKnappDisabled}
                        >
                            {lukkKnappTekst}
                        </ModalKnapp>
                        <ModalKnapp
                            variant="primary"
                            onClick={hovedKnappClick ? () => hovedKnappClick() : () => null}
                            disabled={hovedKnappDisabled}
                        >
                            {hovedKnappTekst}
                        </ModalKnapp>
                    </ButtonContainer>
                )}
            </Modal.Content>
        </ModalContainer>
    );
};
