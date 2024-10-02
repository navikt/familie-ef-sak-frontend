import React from 'react';
import styled from 'styled-components';
import { Button, HStack } from '@navikt/ds-react';

const Container = styled(HStack)`
    margin-top: 1rem;
    margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
`;

interface Props {
    settVisModal: (bool: boolean) => void;
    opprettTilbakekreving: () => void;
}

export const OpprettTilbakekreving: React.FC<Props> = ({ settVisModal, opprettTilbakekreving }) => (
    <Container justify="end" gap="4">
        <ModalKnapp
            variant="tertiary"
            onClick={() => {
                settVisModal(false);
            }}
        >
            Avbryt
        </ModalKnapp>
        <ModalKnapp variant="primary" onClick={() => opprettTilbakekreving()}>
            Opprett
        </ModalKnapp>
    </Container>
);
