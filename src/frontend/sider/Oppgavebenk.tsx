import { OppgaveRequestProvider } from '../context/OppgaveRequestProvider';
import React from 'react';
import Side from '../komponenter/Side/Side';
import OppgaveFiltering from '../komponenter/Oppgave/OppgaveFiltrering';
import OppgaveTabell from '../komponenter/Oppgave/OppgaveTabell';

export const OppgaveBenk = () => {
    return (
        <OppgaveRequestProvider>
            <Side>
                <OppgaveFiltering />
                <OppgaveTabell />
            </Side>
        </OppgaveRequestProvider>
    );
};
