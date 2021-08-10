import * as React from 'react';
import { FC } from 'react';
import { Folkeregisterpersonstatus } from '../../../../App/typer/personopplysninger';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { toTitleCase } from '../../../../App/utils/utils';

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: min-content;
    grid-gap: 0.5rem;
    grid-template-areas: '. .' '. status';
    margin-bottom: 3rem;
`;

const StyledNormaltekstStatus = styled(Normaltekst)`
    grid-area: status;
`;

const FolkeregisterPersonstatus: FC<{ status: Folkeregisterpersonstatus }> = ({ status }) => (
    <StyledDiv>
        <Registergrunnlag />
        <Element tag="h3">Personstatus</Element>
        <StyledNormaltekstStatus>{toTitleCase(status)}</StyledNormaltekstStatus>
    </StyledDiv>
);

export default FolkeregisterPersonstatus;
