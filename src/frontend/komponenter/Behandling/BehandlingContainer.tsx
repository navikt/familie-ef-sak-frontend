import * as React from 'react';
import Fanemeny from '../Fanemeny/Fanemeny';
import Høyremeny from '../Høyremeny/Høyremeny';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import styled from 'styled-components';
import { FC } from 'react';
import { IBehandlingParams } from '../../typer/routing';
import { Redirect, Route, Switch, useParams } from 'react-router';
import { styles } from '../../typer/styles';
import Personopplysninger from './Personopplysninger/Personopplysninger';
import navFarger from 'nav-frontend-core';

const Container = styled.div`
    display: flex;
    height: calc(100vh - 8rem);
`;

const VenstreMenyWrapper = styled.div`
    min-width: 10rem;
    border-right: 2px solid ${styles.farger.navGra40};
    overflow: hidden;
`;

const HøyreMenyWrapper = styled.div`
    border-left: 2px solid ${styles.farger.navGra40};
    overflow-x: hidden;
    overflow-y: scroll;
`;

const InnholdWrapper = styled.div`
    flex: 1;
    overflow: auto;
`;

const FanemenyWrapper = styled.div`
    border-bottom: ${navFarger.navGra40} solid 2px;
`;

const StyledSwitch = styled(Switch)`
    padding: 1rem;
`;

const BehandlingContainer: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();

    return (
        <>
            <Container>
                <VenstreMenyWrapper>Vilkårsoversikt</VenstreMenyWrapper>
                <InnholdWrapper>
                    <FanemenyWrapper>
                        <Fanemeny />
                    </FanemenyWrapper>
                    <StyledSwitch>
                        <Redirect
                            exact={true}
                            from="/behandling/:behandlingId/"
                            to="/behandling/:behandlingId/inngangsvilkar"
                        />
                        <Route
                            exact={true}
                            path="/behandling/:behandlingId/personopplysninger"
                            render={() => {
                                return <Personopplysninger behandlingId={behandlingId} />;
                            }}
                        />
                        <Route
                            exact={true}
                            path="/behandling/:behandlingId/inngangsvilkar"
                            render={() => {
                                return <Inngangsvilkår behandlingId={behandlingId} />;
                            }}
                        />
                    </StyledSwitch>
                </InnholdWrapper>
                <HøyreMenyWrapper>
                    <Høyremeny />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

export default BehandlingContainer;
