import * as React from 'react';
import { FC } from 'react';
import Høyremeny from './Høyremeny/Høyremeny';
import styled from 'styled-components';
import Fanemeny from './Fanemeny/Fanemeny';
import navFarger from 'nav-frontend-core';
import BehandlingRoutes from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import { ModalProvider } from '../../App/context/ModalContext';
import ModalController from '../../Felles/Modal/ModalController';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import VisittkortComponent from '../../Felles/Visittkort/Visittkort';
import { GodkjennEndringer } from './Endringer/GodkjennEndringer';

const Container = styled.div`
    display: flex;
    height: calc(100vh - 6rem);
`;

const VenstreMenyWrapper = styled.div`
    min-width: 3rem;
    max-width: 15rem;
    border-right: 2px solid ${navFarger.navGra40};
    overflow: hidden;
`;

const HøyreMenyWrapper = styled.div`
    border-left: 2px solid ${navFarger.navGra40};
    overflow-x: hidden;
    max-width: 20rem;
    overflow-y: auto;
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
                    <VisittkortComponent
                        data={personopplysningerResponse}
                        behandling={behandling}
                    />
                    <Container>
                        <VenstreMenyWrapper />
                        <InnholdWrapper>
                            <Fanemeny />
                            <BehandlingRoutes />
                            <GodkjennEndringer behandling={behandling} />
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
