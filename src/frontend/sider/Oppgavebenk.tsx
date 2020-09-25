import { OppgaveRequestProvider } from '../context/OppgaveRequestProvider';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../frontend/context/AppContext';
import OppgaveFiltering from '../komponenter/Oppgavebenk/OppgaveFiltrering';
import OppgaveTabell from '../komponenter/Oppgavebenk/OppgaveTabell';
import styled from 'styled-components';

const Side = styled.div`
    padding: 0.5rem;
    height: ~'calc(' 100vh ~'-' 30px ~'-' 1.1rem~ ')';
    width: 100vw;
    overflow: auto;

    & hr {
        margin-top: 2rem;
    }
`;

export const OppgaveBenk: React.FC = () => {
    const { axiosRequest } = useApp();
    const [oppgaver, settOppgaver] = useState([]);

    const hentOppgaver = () => {
        axiosRequest<any>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/hent-oppgave`,
        }).then((res: any) => {
            settOppgaver(res.data.oppgaver);
        });
    };

    return (
        <OppgaveRequestProvider>
            <Side>
                <OppgaveFiltering hentOppgaver={hentOppgaver} />
                <OppgaveTabell oppgaver={oppgaver} />
            </Side>
        </OppgaveRequestProvider>
    );
};
