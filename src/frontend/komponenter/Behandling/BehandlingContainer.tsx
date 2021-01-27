import * as React from 'react';
import { FC } from 'react';
import Høyremeny from '../Høyremeny/Høyremeny';
import styled from 'styled-components';
import { IBehandlingParams } from '../../typer/routing';
import { useParams } from 'react-router';
import Fanemeny from '../Fanemeny/Fanemeny';
import navFarger from 'nav-frontend-core';
import BehandlingRoutes from './BehandlingRoutes';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { ModalProvider } from '../../context/ModalContext';
import ModalController from '../Felleskomponenter/Modal/ModalController';

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

const BehandlingContainer: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();

    return (
        <ModalProvider>
            <BehandlingProvider behandlingId={behandlingId}>
                <ModalController />
                <Container>
                    <VenstreMenyWrapper>Vilkårsoversikt</VenstreMenyWrapper>
                    <InnholdWrapper>
                        <Fanemeny />
                        <BehandlingRoutes />
                    </InnholdWrapper>
                    <HøyreMenyWrapper>
                        <Høyremeny behandlingId={behandlingId} />
                    </HøyreMenyWrapper>
                </Container>
            </BehandlingProvider>
        </ModalProvider>
    );
};

export default BehandlingContainer;
