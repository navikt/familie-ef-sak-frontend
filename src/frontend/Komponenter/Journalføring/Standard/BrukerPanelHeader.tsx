import React from 'react';
import styled from 'styled-components';
import { CopyButton, HStack, Label } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    display: flex;
    gap: 1rem;
`;

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

interface Props {
    navn: string;
    personIdent: string;
}

export const BrukerPanelHeader: React.FC<Props> = ({ navn, personIdent }) => {
    const tittel = `${navn} - ${personIdent}`;

    return (
        <Container>
            <IkonContainer>
                <PersonCircleIcon fontSize={'3.5rem'} />
            </IkonContainer>
            <HStack align="center">
                <Label as={'p'}>{tittel}</Label>
                <CopyButton copyText={personIdent} variant="action" />
            </HStack>
        </Container>
    );
};
