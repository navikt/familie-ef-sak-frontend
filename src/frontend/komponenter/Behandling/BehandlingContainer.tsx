import * as React from 'react';
import { FC } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import Venstremeny from '../Venstremeny/Venstremeny';
import styled from 'styled-components';
import { styles } from '../../typer/styles';
import Høyremeny from '../Høyremeny/Høyremeny';
import { IBehandlingParams } from '../../typer/routing';

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
    padding: 1rem;
    flex: 1;
    overflow: auto;
`;

const BehandlingContainer: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();

    return (
        <>
            <Container>
                <VenstreMenyWrapper>
                    <Venstremeny />
                </VenstreMenyWrapper>
                <InnholdWrapper>
                    <Switch>
                        <Redirect
                            exact={true}
                            from="/behandling/:behandlingId/"
                            to="/behandling/:behandlingId/inngangsvilkar"
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
                <HøyreMenyWrapper>
                    <Høyremeny />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

export default BehandlingContainer;
