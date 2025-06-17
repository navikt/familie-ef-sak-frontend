import styled from 'styled-components';
import * as React from 'react';
import { Detail } from '@navikt/ds-react';
import { LogiskVedlegg } from '../../../../App/typer/dokument';

const Container = styled.ul`
    list-style-type: circle;
`;

export const LogiskeVedlegg: React.FC<{ logiskeVedlegg: LogiskVedlegg[] | undefined }> = ({
    logiskeVedlegg,
}) => (
    <Container>
        {logiskeVedlegg &&
            logiskeVedlegg.map((logiskVedlegg, index) => (
                <li key={logiskVedlegg.tittel + index}>
                    <Detail>{logiskVedlegg.tittel}</Detail>
                </li>
            ))}
    </Container>
);
