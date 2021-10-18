import React from 'react';
import styled from 'styled-components';
import { FamilieTextarea, IFamilieTextareaProps } from '@navikt/familie-form-elements';

export const EnsligTextArea: React.FC<IFamilieTextareaProps> = styled(FamilieTextarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 60rem;
    .typo-element {
        padding-bottom: 0.5rem;
    }
`;
