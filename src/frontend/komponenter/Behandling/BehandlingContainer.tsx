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
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import Venstemeny from '../Venstremeny/Venstremeny';
import VisittkortComponent from '../Felleskomponenter/Visittkort';

const Container = styled.div`
    display: flex;
    height: calc(100vh - 3rem);
`;

const VenstreMenyWrapper = styled.div`
    min-width: 10rem;
    max-width: 15rem;
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
    const { behandling, personopplysningerResponse } = useBehandling();
    return (
        <DataViewer response={{ personopplysningerResponse, behandling }}>
            {({ personopplysningerResponse, behandling }) => (
                <>
                    <VisittkortComponent data={personopplysningerResponse} />
                    <Container>
                        <VenstreMenyWrapper>
                            <Venstemeny behandling={behandling} />
                        </VenstreMenyWrapper>
                        <InnholdWrapper>
                            <Fanemeny />
                            <BehandlingRoutes />
                        </InnholdWrapper>
                        <HøyreMenyWrapper>
                            <Høyremeny />
                        </HøyreMenyWrapper>
                    </Container>
                </>
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
