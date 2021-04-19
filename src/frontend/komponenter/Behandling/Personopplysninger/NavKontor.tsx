import React from 'react';
import { IngenData } from './TabellWrapper';
import { INavKontor } from '../../../typer/personopplysninger';
import Bygning from '../../../ikoner/Bygning';
import styled from 'styled-components';

const StyledNavKontor = styled.div`
    display: grid;
    padding-top: 3rem;
    grid-template-columns: 32px 40px auto 72px;
    grid-template-areas: "'. ikon tittel' '. . kontor'";
`;

const NavKontor: React.FC<{ navKontor?: INavKontor }> = ({ navKontor }) => {
    return (
        <StyledNavKontor>
            <Bygning />
            {(navKontor && (
                <>
                    NAV-Kontor
                    {`${navKontor.enhetNr} - ${navKontor.navn}`})
                </>
            )) || <IngenData />}
        </StyledNavKontor>
    );
};

export default NavKontor;
