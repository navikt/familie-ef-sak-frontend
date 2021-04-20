import React from 'react';
import { IngenData } from './TabellWrapper';
import { INavKontor } from '../../../typer/personopplysninger';
import Bygning from '../../../ikoner/Bygning';
import styled from 'styled-components';
import { Undertittel } from 'nav-frontend-typografi';

const StyledNavKontor = styled.div`
    display: grid;
    padding-top: 3rem;
    grid-template-columns: 32px 40px auto 72px;
    grid-template-areas: '. ikon tittel' '. . kontor';
    padding-bottom: 4rem;
`;

const StyledBygning = styled(Bygning)`
    grid-area: ikon;
`;

const StyledTittel = styled(Undertittel)`
    grid-area: tittel;
`;

const StyledKontorNavn = styled.div`
    grid-area: kontor;
`;

const NavKontor: React.FC<{ navKontor?: INavKontor }> = ({ navKontor }) => {
    return (
        <StyledNavKontor>
            <StyledBygning />
            {(navKontor && (
                <>
                    <StyledTittel>NAV-Kontor</StyledTittel>
                    <StyledKontorNavn>
                        {`${navKontor.enhetNr} - ${navKontor.navn}`}
                    </StyledKontorNavn>
                </>
            )) || <IngenData />}
        </StyledNavKontor>
    );
};

export default NavKontor;
