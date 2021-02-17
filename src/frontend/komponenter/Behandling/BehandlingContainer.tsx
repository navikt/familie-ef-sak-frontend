import * as React from 'react';
import { FC } from 'react';
import Høyremeny from '../Høyremeny/Høyremeny';
import styled from 'styled-components';
import Fanemeny from '../Fanemeny/Fanemeny';
import navFarger from 'nav-frontend-core';
import BehandlingRoutes from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../context/BehandlingContext';
import { ModalProvider } from '../../context/ModalContext';
import ModalController from '../Felleskomponenter/Modal/ModalController';
import Visittkort from '@navikt/familie-visittkort';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../typer/personopplysninger';

const Container = styled.div`
    display: flex;
    height: calc(100vh - 3rem);
`;

const VenstreMenyWrapper = styled.div`
    min-width: 10rem;
    border-right: 2px solid ${navFarger.navGra40};
    overflow: hidden;
`;

const HøyreMenyWrapper = styled.div`
    border-left: 2px solid ${navFarger.navGra40};
    overflow-x: hidden;
    max-width: 20rem;
    overflow-y: scroll;
`;

const InnholdWrapper = styled.div`
    flex: 1;
    overflow: auto;
`;

const StyledVisittkort = styled(Visittkort)`
    .visittkort {
        margin: 0 2rem;
    }
`;

const BehandlingContainer: FC = () => {
    return (
        <ModalProvider>
            <BehandlingProvider>
                <ModalController />
                <Behandling />
            </BehandlingProvider>
        </ModalProvider>
    );
};

const Behandling: FC = () => {
    const { personopplysningerResponse } = useBehandling();
    return (
        <DataViewer response={personopplysningerResponse}>
            {(personOpplysninger: IPersonopplysninger) => {
                return (
                    <>
                        <StyledVisittkort
                            alder={20}
                            ident={personOpplysninger.personIdent}
                            kjønn={personOpplysninger.kjønn}
                            navn={personOpplysninger.navn.visningsnavn}
                        />
                        <Container>
                            <VenstreMenyWrapper>Vilkårsoversikt</VenstreMenyWrapper>
                            <InnholdWrapper>
                                <Fanemeny />
                                <BehandlingRoutes />
                            </InnholdWrapper>
                            <HøyreMenyWrapper>
                                <Høyremeny />
                            </HøyreMenyWrapper>
                        </Container>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingContainer;
