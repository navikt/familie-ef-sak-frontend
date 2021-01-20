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

const FanemenyWrapper = styled.div`
    border-bottom: ${navFarger.navGra40} solid 2px;
`;

const BehandlingContainer: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();

    //Hent status på behandling

    return (
        <BehandlingProvider behandlingId={behandlingId}>
            <Container>
                <VenstreMenyWrapper>Vilkårsoversikt</VenstreMenyWrapper>
                <InnholdWrapper>
                    <FanemenyWrapper>
                        <Fanemeny />
                    </FanemenyWrapper>
                    <BehandlingRoutes />
                </InnholdWrapper>
                <HøyreMenyWrapper>
                    <Høyremeny behandlingId={behandlingId} />
                </HøyreMenyWrapper>
            </Container>
        </BehandlingProvider>
    );
};

export default BehandlingContainer;
