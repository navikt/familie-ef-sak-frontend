import { HeaderMedSøk } from './HeaderMedSøk/HeaderMedSøk';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import { ISaksbehandler } from '../typer/saksbehandler';
import { useApp } from '../context/AppContext';
import UgyldigSesjon from './Felleskomponenter/Modal/SesjonUtløpt';
import BehandlingContainer from './Behandling/BehandlingContainer';
import { OppgaveBenk } from '../sider/Oppgavebenk';
import { Journalforing } from '../sider/Journalforing';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const Container: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const { autentisert, gitBackendInfo } = useApp();

    return (
        <Router>
            {autentisert ? (
                <>
                    <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
                    <table>
                        <thead>
                            <th></th>
                            <th>Branchnavn</th>
                            <th>Committid</th>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Frontend</th>
                                <td>{process.env.GIT_BRANCH_NAME}</td>
                                <td>{process.env.GIT_COMMIT_DATE}</td>
                            </tr>
                            <tr>
                                <th>Backend</th>
                                <td>{gitBackendInfo.branchName}</td>
                                <td>{gitBackendInfo.commitTime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={'container'} role="main">
                        <Switch>
                            <Redirect exact={true} from="/" to="/oppgavebenk" />
                            <Route
                                path="/behandling/:behandlingId"
                                component={BehandlingContainer}
                            />
                            <Route path="/oppgavebenk" component={OppgaveBenk} />
                            <Route path="/journalfor" component={Journalforing} />
                            <Redirect to="/sak" />
                        </Switch>
                    </div>
                </>
            ) : (
                <UgyldigSesjon />
            )}
        </Router>
    );
};

export default Container;
