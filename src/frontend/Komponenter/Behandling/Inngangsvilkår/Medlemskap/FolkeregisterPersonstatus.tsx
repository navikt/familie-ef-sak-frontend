import * as React from 'react';
import { FC } from 'react';
import { Folkeregisterpersonstatus } from '../../../../App/typer/personopplysninger';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import styled from 'styled-components';
import { toTitleCase } from '../../../../App/utils/utils';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { Label } from '@navikt/ds-react';

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: min-content;
    grid-gap: 0.5rem;
    grid-template-areas: '. .' '. status';
`;

const StatusTekst = styled(BodyShortSmall)`
    grid-area: status;
`;

const FolkeregisterPersonstatus: FC<{ status: Folkeregisterpersonstatus }> = ({ status }) => (
    <StyledDiv>
        <Registergrunnlag />
        <Label size={'small'} as="h3">
            Personstatus
        </Label>
        <StatusTekst>{toTitleCase(status)}</StatusTekst>
    </StyledDiv>
);

export default FolkeregisterPersonstatus;
