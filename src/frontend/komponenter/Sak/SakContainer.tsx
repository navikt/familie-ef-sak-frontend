import { kjønnType } from '@navikt/familie-typer';
import AlertStripe from 'nav-frontend-alertstriper';
import * as React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { RessursStatus } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import Høyremeny from '../Høyremeny/Høyremeny';
import Venstremeny from '../Venstremeny/Venstremeny';
import { useSakRessurser } from '../../context/SakContext';
import styled from 'styled-components';
import PersonHeader from '../PersonHeader/PersonHeader';
import { styles } from '../../typer/styles';

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

const SakContainer: React.FunctionComponent = () => {
    const { sakId } = useParams();

    const { ressurser, hentSak } = useSakRessurser();
    React.useEffect(() => {
        if (sakId !== undefined) {
            if (ressurser.sak.status !== RessursStatus.SUKSESS) {
                hentSak(sakId);
            } else if (
                ressurser.sak.status === RessursStatus.SUKSESS &&
                ressurser.sak.data.id !== sakId
            ) {
                hentSak(sakId);
            }
        }
    }, [sakId]);

    switch (ressurser.sak.status) {
        case RessursStatus.SUKSESS:
            switch (ressurser.saksøk.status) {
                case RessursStatus.SUKSESS:
                    return (
                        <>
                            <PersonHeader
                                navn={ressurser.saksøk?.data?.navn?.visningsnavn || 'Ukjent'}
                                ident={ressurser.saksøk.data.personIdent}
                                alder={40}
                                kjønn={ressurser.saksøk?.data?.kjønn || kjønnType.UKJENT}
                                folkeregisterpersonstatus={
                                    ressurser.saksøk?.data?.folkeregisterpersonstatus
                                }
                                adressebeskyttelse={ressurser.saksøk?.data?.adressebeskyttelse}
                            />
                            <Container>
                                <VenstreMenyWrapper>
                                    <Venstremeny />
                                </VenstreMenyWrapper>
                                <InnholdWrapper>
                                    <Switch>
                                        <Route
                                            exact={true}
                                            path="/sak/:sakId"
                                            render={() => {
                                                return <div>Overordnet info om saken</div>;
                                            }}
                                        />
                                        <Route
                                            exact={true}
                                            path="/sak/:sakId/personopplysninger"
                                            render={() => {
                                                return <div>Perosnopplysninger her</div>;
                                            }}
                                        />
                                        <Route
                                            exact={true}
                                            path="/sak/:sakId/medlemskap"
                                            render={() => {
                                                return <div>Her kommer info om medlemskap</div>;
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
                case RessursStatus.HENTER:
                    return <SystemetLaster />;
                default:
                    return <div />;
            }

        case RessursStatus.HENTER:
            return <SystemetLaster />;
        case RessursStatus.IKKE_TILGANG:
            return (
                <AlertStripe
                    children={`Du har ikke tilgang til å se denne saken.`}
                    type={'advarsel'}
                />
            );
        case RessursStatus.FEILET:
            return <AlertStripe children={ressurser.sak.funksjonellFeilmelding} type={'feil'} />;
        default:
            return <div />;
    }
};

export default SakContainer;
