import React from 'react';
import styled from 'styled-components';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { FileTextFillIcon, FileTextIcon } from '@navikt/aksel-icons';
import { Accent600 } from "@navikt/ds-tokens/js";

const Container = styled.div`
    display: flex;
    gap: 1rem;
`;

const DokumentTitler = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
`;

const IkonContainer = styled.div`
    color: ${Accent600};
`;

interface Props {
    dokumentTittel: string;
    erValgt: boolean;
    logiskeVedlegg: string[];
}

export const DokumentPanelHeader: React.FC<Props> = ({
    dokumentTittel,
    erValgt,
    logiskeVedlegg,
}) => {
    return (
        <Container>
            <IkonContainer>
                {erValgt ? (
                    <FileTextFillIcon fontSize={'3.5rem'} />
                ) : (
                    <FileTextIcon fontSize={'3.5rem'} />
                )}
            </IkonContainer>
            <DokumentTitler>
                <Label as={'p'}>{dokumentTittel}</Label>
                {logiskeVedlegg !== undefined &&
                    logiskeVedlegg !== null &&
                    logiskeVedlegg.length > 0 && (
                        <VStack gap={'0'}>
                            {logiskeVedlegg.map((it, index) => (
                                <BodyShort key={index}>{it}</BodyShort>
                            ))}
                        </VStack>
                    )}
            </DokumentTitler>
        </Container>
    );
};
