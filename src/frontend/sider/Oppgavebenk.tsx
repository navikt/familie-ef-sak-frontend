import React, { useState } from 'react';
import { useApp } from '../../frontend/context/AppContext';
import OppgaveFiltering, { IOppgaveRequest } from '../komponenter/Oppgavebenk/OppgaveFiltrering';
import OppgaveTabell, { IOppgaverResponse } from '../komponenter/Oppgavebenk/OppgaveTabell';
import styled from 'styled-components';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

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
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [oppgaveResurs, settOppgaveResurs] = useState<OppgaveResurs>(byggTomRessurs());

    const hentOppgaver = (data: IOppgaveRequest) => {
        axiosRequest<IOppgaverResponse, IOppgaveRequest>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/oppgave/soek`,
                data,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<IOppgaverResponse>) => settOppgaveResurs(res));
    };

    return (
        <Side>
            <OppgaveFiltering hentOppgaver={hentOppgaver} />
            <OppgaveTabell oppgaveResurs={oppgaveResurs} />
        </Side>
    );
};
