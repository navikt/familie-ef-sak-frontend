import { OppgaveRequestProvider } from '../context/OppgaveRequestProvider';
import React, { useEffect } from 'react';
import { useApp } from '../../frontend/context/AppContext';
import OppgaveFiltering from '../komponenter/Oppgave/OppgaveFiltrering';
import OppgaveTabell from '../komponenter/Oppgave/OppgaveTabell';
import styled from 'styled-components';

const Side = styled.div`
    min-height: 100%;
    padding: 2rem 1rem 6rem 1rem;
`;

export const OppgaveBenk: React.FC = () => {
    const { axiosRequest } = useApp();

    useEffect(() => {
        axiosRequest<any>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/hent-oppgave`,
        }).then((res: any) => {
            console.log('YO', res);
        });
    }, []);

    return (
        <OppgaveRequestProvider>
            <Side>
                <OppgaveFiltering />
                <OppgaveTabell />
            </Side>
        </OppgaveRequestProvider>
    );
};
