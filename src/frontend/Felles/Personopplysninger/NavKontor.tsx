import React from 'react';
import { IngenData } from './TabellWrapper';
import { INavKontor } from '../../App/typer/personopplysninger';
import Bygning from '../Ikoner/Bygning';
import styled from 'styled-components';
import PersonopplysningerPanel from './PersonopplysningPanel';

const StyledKontorNavn = styled.div`
    grid-area: innhold;
`;

const NavKontor: React.FC<{ navKontor?: INavKontor }> = ({ navKontor }) => {
    return (
        <PersonopplysningerPanel Ikon={Bygning} tittel="NAV-kontor">
            <StyledKontorNavn>
                {navKontor ? `${navKontor.enhetNr} - ${navKontor.navn}` : <IngenData />}
            </StyledKontorNavn>
        </PersonopplysningerPanel>
    );
};

export default NavKontor;
