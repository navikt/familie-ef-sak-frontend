import { useState, useCallback } from 'react';
import { byggHenterRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useRerunnableEffect } from './felles/useRerunnableEffect';

export interface OppgaverForFerdigstilling {
    behandlingId: string;
    oppgaveIder: number[];
}

const useHentOppgaveIderForFerdigstilling = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [oppgaveIderForFerdigstilling, settOppgaverForFerdigstilling] =
        useState<Ressurs<OppgaverForFerdigstilling>>(byggHenterRessurs());

    const hentOppgaveIderForFerdigstillingCallback = useRerunnableEffect(
        useCallback(() => {
            axiosRequest<OppgaverForFerdigstilling, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgaverforferdigstilling/${behandlingId}`,
            }).then((res: Ressurs<OppgaverForFerdigstilling>) => {
                settOppgaverForFerdigstilling(res);
            });
        }, [axiosRequest, behandlingId]),
        [axiosRequest, behandlingId]
    );
    return { oppgaveIderForFerdigstilling, hentOppgaveIderForFerdigstillingCallback };
};

export default useHentOppgaveIderForFerdigstilling;
