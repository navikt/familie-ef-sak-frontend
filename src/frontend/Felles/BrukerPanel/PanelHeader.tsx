import React from 'react';
import styled from 'styled-components';
import { CopyButton, HStack, Label, Button } from '@navikt/ds-react';
import { EnvelopeClosedIcon, PersonCircleIcon } from '@navikt/aksel-icons';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';
import { NotePencilIcon } from '@navikt/aksel-icons';

const IkonContainer = styled.div`
    color: ${ABlue500};
    padding-right: 1rem;
`;

export enum PanelHeaderType {
    Bruker,
    Avsender,
    Samværsavtale,
}
interface Props {
    navn: string;
    personIdent: string;
    type: PanelHeaderType;
    onClick?: () => void;
}

const utledPanelIkon = (type: PanelHeaderType) => {
    if (type === PanelHeaderType.Avsender) {
        return <EnvelopeClosedIcon fontSize={'3.5rem'} />;
    }
    return <PersonCircleIcon fontSize={'3.5rem'} />;
};

export const PanelHeader: React.FC<Props> = ({ navn, personIdent, type, onClick }) => {
    const tittel = `${navn} - ${personIdent}`;
    const panelIkon = utledPanelIkon(type);

    return (
        <HStack>
            <IkonContainer>{panelIkon}</IkonContainer>
            <HStack align="center" gap={'1'}>
                <Label as={'p'}>{tittel}</Label>
                {type === PanelHeaderType.Samværsavtale ? (
                    <Button
                        icon={<NotePencilIcon title="Rediger" />}
                        variant="tertiary"
                        onClick={onClick}
                    />
                ) : (
                    <CopyButton copyText={personIdent} variant="action" />
                )}
            </HStack>
        </HStack>
    );
};
