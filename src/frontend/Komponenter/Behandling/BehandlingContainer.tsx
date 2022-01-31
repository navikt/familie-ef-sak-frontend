import * as React from 'react';
import { FC, useEffect } from 'react';
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
import { BrevmottakereModal } from './Brevmottakere/BrevmottakereModal';
import { Behandling } from '../../App/typer/fagsak';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { HenleggModal } from './Henleggelse/HenleggModal';

const Container = styled.div`
    display: flex;
`;

const HøyreMenyWrapper = styled.div`
    border-left: 2px solid ${navFarger.navGra40};
    overflow-x: hidden;

    width: 20rem;

    @media (max-width: 800px) {
        width: 0rem;
    }
    overflow-y: auto;
`;

const InnholdWrapper = styled.div`
    flex: 1;
    max-width: calc(100% - 20rem);
    @media (max-width: 800px) {
        max-width: 100%;
    }
`;

const BehandlingContainer: FC = () => {
    return (
        <ModalProvider>
            <BehandlingProvider>
                <ModalController />
                <BehandlingOverbygg />
            </BehandlingProvider>
        </ModalProvider>
    );
};

const BehandlingContent: FC<{
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
}> = ({ behandling, personopplysninger }) => {
    useSetValgtFagsakId(behandling.fagsakId);

    return (
        <>
            <VisittkortComponent data={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper>
                    <Fanemeny behandlingId={behandling.id} />
                    <BehandlingRoutes />
                    <GodkjennEndringer behandling={behandling} />
                    <BrevmottakereModal
                        behandlingId={behandling.id}
                        personopplysninger={personopplysninger}
                    />
                    <HenleggModal behandling={behandling} />
                </InnholdWrapper>
                <HøyreMenyWrapper>
                    <Høyremeny behandlingId={behandling.id} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

const BehandlingOverbygg: FC = () => {
    const { behandling, personopplysningerResponse } = useBehandling();

    useEffect(() => {
        document.title = 'Behandling';
    }, []);

    return (
        <DataViewer response={{ personopplysningerResponse, behandling }}>
            {({ personopplysningerResponse, behandling }) => (
                <BehandlingContent
                    behandling={behandling}
                    personopplysninger={personopplysningerResponse}
                />
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
