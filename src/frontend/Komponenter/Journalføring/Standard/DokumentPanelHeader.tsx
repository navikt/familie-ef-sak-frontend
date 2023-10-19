import React from 'react';
import styled from 'styled-components';
import { BodyShort, Label } from '@navikt/ds-react';
import { FileTextFillIcon, FileTextIcon } from '@navikt/aksel-icons';
import { DokumentInfo } from '../../../App/typer/journalføring';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

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
    color: ${ABlue500};
`;

interface Props {
    dokument: DokumentInfo;
    dokumentTittel: string;
    erValgt: boolean;
}

export const DokumentPanelHeader: React.FC<Props> = ({ dokument, dokumentTittel, erValgt }) => {
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
                {dokument.logiskeVedlegg.map((it) => (
                    <BodyShort key={it.logiskVedleggId}>{it.tittel}</BodyShort>
                ))}
            </DokumentTitler>
        </Container>
    );
};
