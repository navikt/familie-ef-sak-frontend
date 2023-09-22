import React from 'react';
import { INavKontor } from '../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Detail } from '@navikt/ds-react';
import { Buldings3Icon } from '@navikt/aksel-icons';

const NavKontorContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
`;

const OfficeIkon = styled(Buldings3Icon)`
    width: 1rem;
    height: 1rem;
`;

const NavKontor: React.FC<{ navKontor?: INavKontor }> = ({ navKontor }) => {
    return (
        <NavKontorContainer>
            <OfficeIkon />
            <Detail>{navKontor ? `${navKontor.enhetNr} - ${navKontor.navn}` : 'Ingen data'}</Detail>
        </NavKontorContainer>
    );
};

export default NavKontor;
