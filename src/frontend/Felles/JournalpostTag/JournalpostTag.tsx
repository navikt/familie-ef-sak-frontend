import * as React from 'react';
import styled from 'styled-components';
import { Tag } from '@navikt/ds-react';
import { Journalposttype } from '../../App/typer/journalføring';

const StyledTag = styled(Tag)`
    width: 1.5rem;
`;

interface Props {
    journalposttype: Journalposttype;
}

export const JournalpostTag: React.FC<Props> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return (
                <StyledTag variant="info-moderate" size="small">
                    I
                </StyledTag>
            );
        case 'N':
            return (
                <StyledTag variant="neutral-moderate" size="small">
                    N
                </StyledTag>
            );
        case 'U':
            return (
                <StyledTag variant="alt1-moderate" size="small">
                    U
                </StyledTag>
            );
    }
};
