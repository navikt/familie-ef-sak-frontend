import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { byggTomRessurs, byggHenterRessurs, Ressurs } from '../typer/ressurs';
import { IOppgaverResponse } from './useHentOppgaver';

export const useHentOppgaverForFerdigstilling = () => {
    const { axiosRequest } = useApp();
    const [oppgaverForFerdigstilling, settOppgaverForFerdigstilling] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentOppgaverForFerdigstilling = useCallback(
        (behandlingId: string) => {
            settOppgaverForFerdigstilling(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/oppgaver-for-ferdigstilling/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settOppgaverForFerdigstilling(res);
            });
        },
        [axiosRequest]
    );

    return {
        hentOppgaverForFerdigstilling,
        oppgaverForFerdigstilling,
    };
};
