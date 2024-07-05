import styled from 'styled-components';
import * as React from 'react';
import { Detail } from '@navikt/ds-react';
import { LogiskVedlegg } from '../../../App/typer/dokumentliste';

const LogiskVedleggWrapper = styled.ul`
    list-style-type: circle;
`;

export const LogiskeVedlegg: React.FC<{ logiskeVedlegg: LogiskVedlegg[] | undefined }> = ({
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
