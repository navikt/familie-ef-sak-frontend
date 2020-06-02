import Clipboard from '@navikt/familie-clipboard';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { kjønnType } from '@navikt/familie-typer';
import Element, { Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';

import { Adressebeskyttelse, Folkeregisterpersonstatus } from '../../typer/personopplysninger';
import PersonStatusVarsel from '../Felleskomponenter/PersonStatusVarsel';
import styled from 'styled-components';
import AdressebeskyttelseVarsel from '../Felleskomponenter/AdressebeskyttelseVarsel';
import { styles } from '../../typer/styles';

const StyledFamilieIkonVelger = styled(FamilieIkonVelger)`
    height: auto;
    margin-right: 0.5rem;
    width: 1.5rem;
`;

const PersonHeaderWrapper = styled.div`
    padding: 0.875rem 2rem;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: ${styles.farger.navLysGra};
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

export interface IProps {
    alder: number;
    ident: string;
    kjønn: kjønnType;
    navn: string;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    adressebeskyttelse?: Adressebeskyttelse;
}

const PersonHeader: React.FC<IProps> = ({
    alder,
    ident,
    kjønn,
    navn,
    folkeregisterpersonstatus,
    adressebeskyttelse,
}) => {
    return (
        <PersonHeaderWrapper>
            <StyledFamilieIkonVelger alder={alder} kjønn={kjønn} />
            <Element type={'element'}>{navn}</Element>
            <ElementWrapper>
                <Clipboard>
                    <Normaltekst>{ident}</Normaltekst>
                </Clipboard>
            </ElementWrapper>
            {folkeregisterpersonstatus && (
                <ElementWrapper>
                    <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                </ElementWrapper>
            )}
            {adressebeskyttelse && (
                <ElementWrapper>
                    <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
                </ElementWrapper>
            )}
        </PersonHeaderWrapper>
    );
};

export default PersonHeader;
