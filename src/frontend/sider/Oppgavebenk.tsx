import { OppgaveRequestProvider } from '../context/OppgaveRequestProvider';
import React from 'react';
import OppgaveFiltering from '../komponenter/Oppgave/OppgaveFiltrering';
import OppgaveTabell from '../komponenter/Oppgave/OppgaveTabell';
import styled from 'styled-components';

const Side = styled.div`
    min-height: 100%;
    padding: 2rem 1rem 6rem 1rem;
`;

export const OppgaveBenk: React.FC = () => {
    return (
        <OppgaveRequestProvider>
            <Side>
                <OppgaveFiltering />
                <OppgaveTabell />
            </Side>
        </OppgaveRequestProvider>
    );
};
