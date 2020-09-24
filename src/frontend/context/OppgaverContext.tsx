import createUseContext from 'constate';
import React from 'react';
import { useHistory } from 'react-router';
import { useApp } from './AppContext';
import Oppgavebenk from '../komponenter/Oppgavebenk/Oppgavebenk';

const [OppgaveProvider, useOppgaver] = createUseContext(() => {
    const history = useHistory();
    const {axiosRequest, innloggetSaksbehandler} = useApp();
});

const Oppgaver: React.FC = () => {
    return (
        <OppgaverProvider>
            <Oppgavebenk />
        </OppgaverProvider>
    );
};

export {Oppgaver, useOppgaver};