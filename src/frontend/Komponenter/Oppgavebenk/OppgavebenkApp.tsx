import React, { useCallback, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import OppgaveFiltering from './OppgaveFiltrering';
import OppgaveTabell, { IOppgaverResponse } from './OppgaveTabell';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import { IOppgaveRequest } from './typer/oppgaverequest';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { Side } from '../../Felles/Visningskomponenter/Side';

export type OppgaveRessurs = Ressurs<IOppgaverResponse>;

export const OppgavebenkApp: React.FC = () => {
    const { axiosRequest } = useApp();
    const [oppgaveResurs, settOppgaveResurs] = useState<OppgaveRessurs>(byggTomRessurs());

    const hentOppgaver = useCallback(
        (data: IOppgaveRequest) => {
            axiosRequest<IOppgaverResponse, IOppgaveRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/oppgave/soek`,
                data,
            }).then((res: Ressurs<IOppgaverResponse>) => settOppgaveResurs(res));
        },
        [axiosRequest]
    );

    return (
        <Side className={'container'}>
            {process.env.ENV !== 'production' && <OpprettDummyBehandling />}
            <OppgaveFiltering hentOppgaver={hentOppgaver} />
            <OppgaveTabell oppgaveRessurs={oppgaveResurs} />
        </Side>
    );
};
