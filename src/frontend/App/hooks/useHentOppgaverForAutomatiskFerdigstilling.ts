import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgaverResponse } from './useHentOppgaver';

export const useHentOppgaverForAutomatiskFerdigstilling = () => {
    const { axiosRequest } = useApp();
    const [oppgaverForAutomatiskFerdigstilling, settOppgaverForAutomatiskFerdigstilling] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentOppgaverForAutomatiskFerdigstilling = useCallback(
        (behandlingId: string) => {
            settOppgaverForAutomatiskFerdigstilling(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/flereoppgaver/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settOppgaverForAutomatiskFerdigstilling(res);
            });
        },
        [axiosRequest]
    );

    return { hentOppgaverForAutomatiskFerdigstilling, oppgaverForAutomatiskFerdigstilling };
};
