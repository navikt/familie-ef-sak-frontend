import { kjønnType } from '@navikt/familie-typer';
import AlertStripe from 'nav-frontend-alertstriper';
import * as React from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { RessursStatus } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import Høyremeny from '../Høyremeny/Høyremeny';
import Venstremeny from '../Venstremeny/Venstremeny';
import { useSakRessurser } from '../../context/SakContext';
import styled from 'styled-components';
import PersonHeader from '../PersonHeader/PersonHeader';
import { styles } from '../../typer/styles';
import Personopplysninger from './Personopplysninger';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import AnyData from './AnyData';
import { ISak } from '../../typer/sak';

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
                ressurser.sakId !== sakId
            ) {
                hentSak(sakId);
            }
        }
    }, [sakId]);

    function hentetSak(sak: ISak, personopplysninger: IPersonopplysninger) {
        return (
            <>
                <PersonHeader
                    navn={personopplysninger.navn?.visningsnavn || 'Ukjent'}
                    ident={personopplysninger.personIdent}
                    alder={40}
                    kjønn={personopplysninger.kjønn || kjønnType.UKJENT}
                    folkeregisterpersonstatus={personopplysninger.folkeregisterpersonstatus}
                    adressebeskyttelse={personopplysninger.adressebeskyttelse}
                />
                <Container>
                    <VenstreMenyWrapper>
                        <Venstremeny />
                    </VenstreMenyWrapper>
                    <InnholdWrapper>
                        <Switch>
                            <Redirect
                                exact={true}
                                from="/sak/:sakId/"
                                to="/sak/:sakId/personopplysninger"
                            />
                            <Route
                                exact={true}
                                path="/sak/:sakId/personopplysninger"
                                render={() => {
                                    return <Personopplysninger data={personopplysninger} />;
                                }}
                            />
                            <Route
                                exact={true}
                                path="/sak/:sakId/overgangsstonad"
                                render={() => {
                                    // TODO endre til Overgangsstønad og hent data for overgangsstønad
                                    return <AnyData data={sak.overgangsstønad} />;
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
    }

    switch (ressurser.sak.status) {
        case RessursStatus.SUKSESS:
            switch (ressurser.personopplysninger.status) {
                case RessursStatus.SUKSESS:
                    return hentetSak(ressurser.sak.data, ressurser.personopplysninger.data);
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
            return <AlertStripe children={ressurser.sak.frontendFeilmelding} type={'feil'} />;
        default:
            return <div />;
    }
};

export default SakContainer;
