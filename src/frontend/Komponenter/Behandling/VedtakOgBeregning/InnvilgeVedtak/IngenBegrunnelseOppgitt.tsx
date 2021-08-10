import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import styled from 'styled-components';

export const StyledDiv = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

export const IngenBegrunnelseOppgitt: React.FC = () => {
    return (
        <StyledDiv>
            <Element className={'blokk-xxs'}>Begrunnelse</Element>
            <Normaltekst style={{ fontStyle: 'italic' }}>Ingen opplysninger oppgitt.</Normaltekst>
        </StyledDiv>
    );
};
