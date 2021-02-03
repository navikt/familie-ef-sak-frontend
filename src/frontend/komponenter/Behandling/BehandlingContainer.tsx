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
import Venstemeny from '../Venstremeny/Venstremeny';
import { RessursStatus } from '../../typer/ressurs';

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

const BehandlingWrapper: FC = () => {
    const { behandling } = useBehandling();
    if (behandling.status !== RessursStatus.SUKSESS) {
        return null;
    }
    return (
        <>
            <ModalController />
            <Container>
                <VenstreMenyWrapper>
                    <Venstemeny />
                </VenstreMenyWrapper>
                <InnholdWrapper>
                    <Fanemeny />
                    <BehandlingRoutes />
                </InnholdWrapper>
                <HøyreMenyWrapper>
                    <Høyremeny behandlingId={behandling.data.id} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

const BehandlingContainer: FC = () => {
    return (
        <ModalProvider>
            <BehandlingProvider>
                <BehandlingWrapper />
            </BehandlingProvider>
        </ModalProvider>
    );
};

export default BehandlingContainer;
