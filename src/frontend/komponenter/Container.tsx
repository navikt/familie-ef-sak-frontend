import { HeaderMedSøk } from './HeaderMedSøk/HeaderMedSøk';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PersonInfo from './Person/PersonInfo';
import * as React from 'react';
import { ISaksbehandler } from '../typer/saksbehandler';
import { useApp } from '../context/AppContext';
import UgyldigSesjon from './Felleskomponenter/Modal/SesjonUtløpt';
import { SakProvider } from '../context/SakContext';
import SakContainer from './Sak/SakContainer';
import SakListeContainer from './Sak/SakListeContainer';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const Container: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const { autentisert } = useApp();

    return (
        <Router>
            {autentisert ? (
                <>
                    <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
                    <div className={'container'} role="main">
                        <SakProvider>
                            <Switch>
                                <Redirect exact={true} from="/" to="/sak" />
                                <Route path="/sak/:sakId" component={SakContainer} />
                                <Route
                                    path="/sak"
                                    render={() => {
                                        return (
                                            <div>
                                                <PersonInfo />
                                                <SakListeContainer />
                                            </div>
                                        );
                                    }}
                                />
                            </Switch>
                        </SakProvider>
                    </div>
                </>
            ) : (
                <UgyldigSesjon />
            )}
        </Router>
    );
};

export default Container;
