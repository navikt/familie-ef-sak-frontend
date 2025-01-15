import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgaverResponse } from '../../Komponenter/Oppgavebenk/OppgaveTabell';
import { IOppgaveRequest } from '../../Komponenter/Oppgavebenk/typer/oppgaverequest';

export const useHentOppgaver = () => {
    const { axiosRequest } = useApp();
    const [oppgaver, settOppgaver] = useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentOppgaver = useCallback(
        (data: IOppgaveRequest) => {
            settOppgaver(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, IOppgaveRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/oppgave/soek`,
                data,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settOppgaver(res);
            });
        },
        [axiosRequest]
    );

    return { hentOppgaver, oppgaver };
};
