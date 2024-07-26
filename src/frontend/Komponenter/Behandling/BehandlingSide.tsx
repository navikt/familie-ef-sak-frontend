import * as React from 'react';
import { FC, useEffect } from 'react';
import Høyremeny from './Høyremeny/Høyremeny';
import styled from 'styled-components';
import BehandlingRoutes from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import PersonHeaderComponent from '../../Felles/PersonHeader/PersonHeader';
import { Behandling } from '../../App/typer/fagsak';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { HenleggModal } from './Modal/HenleggModal';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { InfostripeUtestengelse } from './InfostripeUtestengelse';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';
import { EkspanderbareVilkårpanelProvider } from '../../App/context/EkspanderbareVilkårpanelContext';
import Personopplysningsendringer from './Endring/EndringPersonopplysninger';
import { SettPåVent } from './SettPåVent/SettPåVent';
import { NyEierModal } from './Modal/NyEierModal';
import { Fanemeny } from './Fanemeny/Fanemeny';

const Container = styled.div`
    display: flex;
    flex-shrink: 2;
    height: calc(
        100vh - ${106}px
    ); // Magisk tall som er høyden på header pluss PersonHeaderComponent
`;

interface InnholdWrapperProps {
    $åpenHøyremeny: boolean;
}

interface HøyreMenyWrapperProps {
    $åpenHøyremeny: boolean;
}

const HøyreMenyWrapper = styled.div<HøyreMenyWrapperProps>`
    border-left: 2px solid ${ABorderDefault};

    background-color: white;

    flex-shrink: 1;
    flex-grow: 0;

    width: ${(p) => (p.$åpenHøyremeny ? '20rem' : '1.5rem')};
    min-width: ${(p) => (p.$åpenHøyremeny ? '20rem' : '1.5rem')};

    transition: all 0.25s;

    z-index: 10;

    overflow-y: auto;
`;

const InnholdWrapper = styled.div<InnholdWrapperProps>`
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;

    max-width: ${(p) => (p.$åpenHøyremeny ? 'calc(100% - 20rem)' : '100%')};

    overflow-y: auto;

    position: relative;
`;

export const BehandlingSide: FC = () => (
    <BehandlingProvider>
        <Side />
    </BehandlingProvider>
);

const Side: FC = () => {
    const { behandling, personopplysningerResponse } = useBehandling();

    useEffect(() => {
        document.title = 'Behandling';
    }, []);

    return (
        <DataViewer response={{ personopplysningerResponse, behandling }}>
            {({ personopplysningerResponse, behandling }) => (
                <SideInnhold
                    behandling={behandling}
                    personopplysninger={personopplysningerResponse}
                />
            )}
        </DataViewer>
    );
};

interface Props {
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
}

const SideInnhold: FC<Props> = ({ behandling, personopplysninger }) => {
    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);
    const { åpenHøyremeny } = useBehandling();

    return (
        <>
            <PersonHeaderComponent data={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper $åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandling={behandling} />
                    <SettPåVent behandling={behandling} />
                    <InfostripeUtestengelse />
                    <Personopplysningsendringer behandlingId={behandling.id} />
                    <EkspanderbareVilkårpanelProvider>
                        <BehandlingRoutes behandling={behandling} />
                    </EkspanderbareVilkårpanelProvider>
                    <HenleggModal behandling={behandling} />
                    <NyEierModal />
                </InnholdWrapper>
                <HøyreMenyWrapper $åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny behandling={behandling} åpenHøyremeny={åpenHøyremeny} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};
