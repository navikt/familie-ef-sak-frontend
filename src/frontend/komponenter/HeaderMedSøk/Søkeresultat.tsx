import React from 'react';
import styled from 'styled-components';
import { Element, EtikettLiten } from 'nav-frontend-typografi';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { IKjønnKortType } from '../../typer/person';
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
    kjønn?: IKjønnKortType;
    onClick: () => void;
}

const kjønnTilKjønnType = (kjønn?: IKjønnKortType) => {
    if (kjønn === IKjønnKortType.Kvinne) {
        return kjønnType.KVINNE;
    } else if (kjønn === IKjønnKortType.Mann) {
        return kjønnType.MANN;
    }
    return kjønnType.UKJENT;
};

const Søkeresultat: React.FC<IProps> = ({ alder, navn, ident, kjønn, onClick }) => {
    return (
        <StyledResultat onClick={onClick} role={'button'}>
            <FamilieIkonVelger
                className={'familie-ikon-velger'}
                alder={alder}
                kjønn={kjønnTilKjønnType(kjønn)}
            />
            <NavnOgIdent>
                <Element>
                    {navn} ({ident})
                </Element>
                <EtikettLiten>(Løpende søknad/Ingen sak)</EtikettLiten>
            </NavnOgIdent>
        </StyledResultat>
    );
};

export default Søkeresultat;
