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
import PersonHeaderComponent from '../../Felles/PersonHeader/PersonHeader';
import { GodkjennEndringer } from './Endringer/GodkjennEndringer';
import { BrevmottakereModal } from './Brevmottakere/BrevmottakereModal';
import { Behandling } from '../../App/typer/fagsak';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { useSetValgtFagsakPersonIdent } from '../../App/hooks/useSetValgtFagsakPersonIdent';
import { HenleggModal } from './Henleggelse/HenleggModal';

const Container = styled.div`
    display: flex;

    flex-shrink: 2;
`;

interface InnholdWrapperProps {
    åpenHøyremeny: boolean;
}

interface HøyreMenyWrapperProps {
    åpenHøyremeny: boolean;
}

const HøyreMenyWrapper = styled.div<HøyreMenyWrapperProps>`
    border-left: 2px solid ${navFarger.navGra40};

    flex-shrink: 1;
    flex-grow: 0;

    width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};
    min-width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};

    transition: all 0.25s;
`;

const InnholdWrapper = styled.div<InnholdWrapperProps>`
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: 0px;
    min-width: 0px;

    overflow-x: scroll;

    height: 90vh;

    max-width: ${(p) => (p.åpenHøyremeny ? 'calc(100% - 20rem)' : '100%')};
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
    useSetValgtFagsakPersonIdent({
        fagsakId: behandling.fagsakId,
        personIdent: personopplysninger.personIdent,
    });
    const { åpenHøyremeny } = useBehandling();

    return (
        <>
            <PersonHeaderComponent data={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandlingId={behandling.id} />
                    <BehandlingRoutes />
                    <GodkjennEndringer behandling={behandling} />
                    <BrevmottakereModal
                        behandlingId={behandling.id}
                        personopplysninger={personopplysninger}
                    />
                    <HenleggModal behandling={behandling} />
                </InnholdWrapper>
                <HøyreMenyWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandlingId={behandling.id} />
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
