import React, { FC } from 'react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import GrønnHake from '../../../ikoner/GrønnHake';
import Advarsel from '../../../ikoner/Advarsel';

const StyledVisning = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-auto-rows: min-content;
    grid-gap: 1rem;

    svg {
        max-height: 24px;
        grid-column: 1/2;
    }

    .tittel {
        grid-column: 2/4;
        padding-bottom: 1rem;
    }
`;

const Vilkårsvisning: FC = () => {
    const erVurdert = false;

    return (
        <StyledVisning>
            {erVurdert ? <GrønnHake /> : <Advarsel />}
            <Element className="tittel">Medlemskap</Element>

            <Normaltekst>ddd</Normaltekst>
            <Normaltekst>ddd</Normaltekst>
            <Normaltekst>ddd</Normaltekst>
        </StyledVisning>
    );
};

export default Vilkårsvisning;
