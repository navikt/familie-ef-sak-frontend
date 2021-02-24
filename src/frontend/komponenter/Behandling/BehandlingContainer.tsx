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
import { VisittkortWrapper } from '../../sider/Fagsakoversikt';
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
    if (behandling.status !== RessursStatus.SUKSESS) {
        return null; // TODO vis henter/feil ?
    }
    return (
        <DataViewer response={personopplysningerResponse}>
            {(personOpplysninger: IPersonopplysninger) => {
                return (
                    <>
                        <VisittkortWrapper>
                            <Visittkort
                                alder={20}
                                ident={personOpplysninger.personIdent}
                                kjønn={personOpplysninger.kjønn}
                                navn={personOpplysninger.navn.visningsnavn}
                            />
                        </VisittkortWrapper>
                        <Container>
                            <VenstreMenyWrapper>
                                <Venstemeny />
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
                );
            }}
        </DataViewer>
    );
};

export default BehandlingContainer;
