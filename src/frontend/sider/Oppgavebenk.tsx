import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import OppgaveFiltering from '../komponenter/Oppgavebenk/OppgaveFiltrering';
import OppgaveTabell, { IOppgaverResponse } from '../komponenter/Oppgavebenk/OppgaveTabell';
import styled from 'styled-components';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { IOppgaveRequest } from '../komponenter/Oppgavebenk/oppgaverequest';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';

const Side = styled.div`
    padding: 0.5rem;
    width: 100vw;
    overflow: auto;
    min-height: 100vh;

    & hr {
        margin-top: 2rem;
    }
`;

export type OppgaveResurs = Ressurs<IOppgaverResponse>;

export const OppgaveBenk: React.FC = () => {
    const { axiosRequest } = useApp();
    const [oppgaveResurs, settOppgaveResurs] = useState<OppgaveResurs>(byggTomRessurs());

    const hentOppgaver = (data: IOppgaveRequest) => {
        axiosRequest<IOppgaverResponse, IOppgaveRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/soek`,
            data,
        }).then((res: Ressurs<IOppgaverResponse>) => settOppgaveResurs(res));
    };

    return (
        <Side>
            {process.env.ENV !== 'production' && <OpprettDummyBehandling />}
            <OppgaveFiltering hentOppgaver={hentOppgaver} />
            <OppgaveTabell oppgaveResurs={oppgaveResurs} />
        </Side>
    );
};
