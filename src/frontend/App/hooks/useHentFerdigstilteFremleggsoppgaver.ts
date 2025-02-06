import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { byggTomRessurs, byggHenterRessurs, Ressurs } from '../typer/ressurs';
import { IOppgaverResponse } from './useHentOppgaver';

export const useHentFerdigestilteFremleggsoppgaver = () => {
    const { axiosRequest } = useApp();
    const [ferdigstilteFremleggsoppgaver, settFerdigstilteFremleggsoppgaver] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentFerdigstilteFremleggsoppgaver = useCallback(
        (behandlingId: string) => {
            settFerdigstilteFremleggsoppgaver(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/hent-ferdigstilte-fremleggsoppgaver/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settFerdigstilteFremleggsoppgaver(res);
            });
        },
        [axiosRequest]
    );

    return { hentFerdigstilteFremleggsoppgaver, ferdigstilteFremleggsoppgaver };
};
