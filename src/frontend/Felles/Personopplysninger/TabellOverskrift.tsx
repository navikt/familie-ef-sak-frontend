import React from 'react';
import styled from 'styled-components';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {
    Ikon: React.FC;
    tittel: string;
    tittelbeskrivelse?: React.ReactElement;
}

const StyledTittel = styled.div`
    grid-area: tittel;
    display: flex;
    gap: 1rem;
`;

const StyledIkon = styled.div`
    grid-area: ikon;
    justify-self: left;
`;

const TabellOverskrift: React.FC<Props> = ({ Ikon, tittel, tittelbeskrivelse }) => {
    return (
        <>
            <StyledIkon>
                <Ikon />
            </StyledIkon>
            <StyledTittel>
                <Undertittel>{tittel}</Undertittel>
                <div>{tittelbeskrivelse}</div>
            </StyledTittel>
        </>
    );
};

export default TabellOverskrift;
