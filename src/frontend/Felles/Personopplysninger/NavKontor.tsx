import React from 'react';
import { IngenData } from './TabellWrapper';
import { INavKontor } from '../../App/typer/personopplysninger';
import Bygning from '../Ikoner/Bygning';
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
            <StyledTittel>NAV-Kontor</StyledTittel>
            <StyledKontorNavn>
                {navKontor ? `${navKontor.enhetNr} - ${navKontor.navn}` : <IngenData />}
            </StyledKontorNavn>
        </StyledNavKontor>
    );
};

export default NavKontor;
