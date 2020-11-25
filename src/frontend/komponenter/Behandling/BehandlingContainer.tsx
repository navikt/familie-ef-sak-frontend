import * as React from 'react';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import navFarger from 'nav-frontend-core';
import styled from 'styled-components';
import { FC } from 'react';
import { IBehandlingParams } from '../../typer/routing';
import { Redirect, Route, Switch, useParams } from 'react-router';
import { styles } from '../../typer/styles';
import Fanemeny from '../Fanemeny/Fanemeny';

const Container = styled.div`
    display: flex;
    height: calc(100vh - 8rem);
`;

const VenstreMenyWrapper = styled.div`
    min-width: 10rem;
    border-right: 2px solid ${styles.farger.navGra40};
    overflow: hidden;
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
                            path="/behandling/:behandlingId/inngangsvilkar"
                            render={() => {
                                return <Inngangsvilkår behandlingId={behandlingId} />;
                            }}
                        />
                    </StyledSwitch>
                </InnholdWrapper>
                {/*<HøyreMenyWrapper>
                    <Høyremeny behandlingId={behandlingId} />
                </HøyreMenyWrapper>*/}
            </Container>
        </>
    );
};

export default BehandlingContainer;
