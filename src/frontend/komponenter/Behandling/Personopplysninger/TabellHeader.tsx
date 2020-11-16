import React from 'react';
import styled from 'styled-components';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {
    Ikon: React.FC;
    tittel: string;
}

const StyledTittel = styled(Undertittel)`
    grid-area: tittel;
`;

const StyledIkon = styled.div`
    grid-area: ikon;
    justify-self: left;
`;

const TabellHeader: React.FC<Props> = ({ Ikon, tittel }) => {
    return (
        <>
            <StyledIkon>
                <Ikon />
            </StyledIkon>
            <StyledTittel>{tittel}</StyledTittel>
        </>
    );
};

export default TabellHeader;
