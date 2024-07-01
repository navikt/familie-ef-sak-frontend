import styled from 'styled-components';
import * as React from 'react';
import { ILogiskVedlegg } from '@navikt/familie-typer';
import { Detail } from '@navikt/ds-react';

const LogiskVedleggWrapper = styled.ul`
    list-style-type: circle;
`;

export const LogiskeVedlegg: React.FC<{ logiskeVedlegg: ILogiskVedlegg[] | undefined }> = ({
    logiskeVedlegg,
}) => (
    <LogiskVedleggWrapper>
        {logiskeVedlegg &&
            logiskeVedlegg.map((logiskVedlegg, index) => (
                <li key={logiskVedlegg.tittel + index}>
                    <Detail>{logiskVedlegg.tittel}</Detail>
                </li>
            ))}
    </LogiskVedleggWrapper>
);
