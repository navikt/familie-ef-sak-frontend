import * as React from 'react';
import { BodyShort, Button } from '@navikt/ds-react';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../../App/typer/dokument';
import { JournalpostTag } from '../../../../Felles/JournalpostTag/JournalpostTag';

const Container = styled.li`
    display: grid;
    grid-template-columns: repeat(2, minmax(2rem, max-content));
    gap: 0.5rem;
    margin: 0.5rem 0;
`;

const StyledButton = styled(Button)`
    margin: 0;
    padding: 0;
    text-align: left;
`;

export interface Props {
    dokument: Dokumentinfo;
    onClick: (dokument: Dokumentinfo) => void;
}

export const DokumentListeElement: React.FC<Props> = ({ dokument, onClick }) => (
    <Container>
        <div>
            <JournalpostTag journalposttype={dokument.journalposttype} />
        </div>
        <div>
            <StyledButton variant="tertiary" size="small" onClick={() => onClick(dokument)}>
                {dokument.tittel}
            </StyledButton>
            <BodyShort size="small">{dokument.dato}</BodyShort>
            <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
        </div>
    </Container>
);
