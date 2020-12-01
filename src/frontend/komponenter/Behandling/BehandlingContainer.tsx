import * as React from 'react';
import { FC } from 'react';
import Høyremeny from '../Høyremeny/Høyremeny';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import styled from 'styled-components';
import { IBehandlingParams } from '../../typer/routing';
import { Redirect, Route, Switch, useParams } from 'react-router';
import Fanemeny from '../Fanemeny/Fanemeny';
import Personopplysninger from './Personopplysninger/Personopplysninger';
import navFarger from 'nav-frontend-core';

const Container = styled.div`
    display: flex;
    height: calc(100vh - 8rem);
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

    return (
        <>
            <Container>
                <VenstreMenyWrapper>Vilkårsoversikt</VenstreMenyWrapper>
                <InnholdWrapper>
                    <FanemenyWrapper>
                        <Fanemeny />
                    </FanemenyWrapper>
                    <Switch>
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
                    </Switch>
                </InnholdWrapper>
            </Container>
        </>
    );
};

export default BehandlingContainer;
