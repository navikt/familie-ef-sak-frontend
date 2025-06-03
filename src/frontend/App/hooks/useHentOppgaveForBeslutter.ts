import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgaverResponse } from './useHentOppgaver';

export const useHentOppgaveForBeslutter = () => {
    const { axiosRequest } = useApp();
    const [oppgaverForBeslutter, settOppgaverForBeslutter] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs<IOppgaverResponse>());

    const hentOppgaverForBeslutter = useCallback(
        (behandlingId: string) => {
            settOppgaverForBeslutter(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/flereoppgaver/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settOppgaverForBeslutter(res);
            });
        },
        [axiosRequest]
    );

    return { hentOppgaverForBeslutter, oppgaverForBeslutter };
};
