import React, { FC } from 'react';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import PersonStatusVarsel from './PersonStatusVarsel';
import AdressebeskyttelseVarsel from './AdressebeskyttelseVarsel';
import { EtikettAdvarsel } from 'nav-frontend-etiketter';

export const VisittkortWrapper = styled.div`
    .visittkort {
        padding: 0 1.5rem;
    }
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const VisittkortComponent: FC<{ data: IPersonopplysninger }> = ({ data }) => {
    const {
        personIdent,
        kjønn,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
    } = data;
    return (
        <VisittkortWrapper>
            <Visittkort alder={20} ident={personIdent} kjønn={kjønn} navn={navn.visningsnavn}>
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
                {egenAnsatt && (
                    <ElementWrapper>
                        <EtikettAdvarsel mini>Egen ansatt</EtikettAdvarsel>
                    </ElementWrapper>
                )}
            </Visittkort>
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
