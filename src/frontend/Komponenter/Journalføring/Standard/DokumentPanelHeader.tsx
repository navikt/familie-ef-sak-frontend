import React from 'react';
import styled from 'styled-components';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { ExternalLinkIcon, FileTextFillIcon, FileTextIcon } from '@navikt/aksel-icons';
import { DokumentInfo } from '../../../App/typer/journalføring';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';
import { åpneFilIEgenTab } from '../../../App/utils/utils';

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

const Tittel = styled.div`
    display: flex;
    align-items: center;
`;

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

interface Props {
    dokument: DokumentInfo;
    dokumentTittel: string;
    journalpostId: string;
    valgt: boolean;
}

export const DokumentPanelHeader: React.FC<Props> = ({
    dokument,
    dokumentTittel,
    journalpostId,
    valgt,
}) => {
    return (
        <Container>
            <IkonContainer>
                {valgt ? (
                    <FileTextFillIcon fontSize={'3.5rem'} />
                ) : (
                    <FileTextIcon fontSize={'3.5rem'} />
                )}
            </IkonContainer>
            <DokumentTitler>
                <Tittel>
                    <Label as={'p'}>{dokumentTittel}</Label>
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        icon={<ExternalLinkIcon aria-hidden />}
                        onClick={() =>
                            åpneFilIEgenTab(journalpostId, dokument.dokumentInfoId, dokumentTittel)
                        }
                    />
                </Tittel>
                {dokument.logiskeVedlegg.map((it) => (
                    <BodyShort key={it.logiskVedleggId}>{it.tittel}</BodyShort>
                ))}
            </DokumentTitler>
        </Container>
    );
};
