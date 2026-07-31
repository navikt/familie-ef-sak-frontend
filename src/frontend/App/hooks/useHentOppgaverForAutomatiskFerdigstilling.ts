import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgaverResponse } from './useHentOppgaver';

export const useHentOppgaverForAutomatiskFerdigstilling = () => {
    const { axiosRequest } = useApp();
    const [oppgaverSomKanAutomatiskFerdigstilles, settOppgaverSomKanAutomatiskFerdigstilles] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentOppgaverSomKanAutomatiskFerdigstilles = useCallback(
        (behandlingId: string) => {
            settOppgaverSomKanAutomatiskFerdigstilles(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/oppgaver-for-automatisk-ferdigstilling/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settOppgaverSomKanAutomatiskFerdigstilles(res);
            });
        },
        [axiosRequest]
    );

    return { hentOppgaverSomKanAutomatiskFerdigstilles, oppgaverSomKanAutomatiskFerdigstilles };
};
