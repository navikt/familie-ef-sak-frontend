import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { kjønnType } from '@navikt/familie-typer';

const NavnOgIdent = styled.div``;
const StyledResultat = styled.div`
    background-color: #3e3832;
    color: #fff;
    padding: 10px;
    font-size: 0.8rem;
    display: flex;
`;

interface IProps {
    alder: number;
    navn: string;
    ident: string;
    kjønn: kjønnType;
    onClick: () => void;
}

const Søkeresultat: React.FC<IProps> = ({ alder, navn, ident, kjønn, onClick }) => {
    return (
        <StyledResultat onClick={onClick} role={'button'}>
            <FamilieIkonVelger className={'familie-ikon-velger'} alder={alder} kjønn={kjønn} />
            <NavnOgIdent>
                <Element>
                    {navn} ({ident})
                </Element>
            </NavnOgIdent>
        </StyledResultat>
    );
};

export default Søkeresultat;
