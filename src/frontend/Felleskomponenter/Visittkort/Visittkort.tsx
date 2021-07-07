import React, { FC } from 'react';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import PersonStatusVarsel from '../PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../AdressebeskyttelseVarsel';
import { EtikettAdvarsel } from 'nav-frontend-etiketter';
import { Behandling } from '../../typer/fagsak';
import Behandlingsinfo from './Behandlingsinfo';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Sticky';

export const VisittkortWrapper = styled(Sticky)`
    display: flex;
    border-bottom: 1px solid ${navFarger.navGra80};
    z-index: 1227;

    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;
const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const VisittkortComponent: FC<{ data: IPersonopplysninger; behandling?: Behandling }> = ({
    data,
    behandling,
}) => {
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
            {behandling && <Behandlingsinfo behandling={behandling} />}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
