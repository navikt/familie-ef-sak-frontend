import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { OppgaveTypeForOpprettelse } from '../../Komponenter/Behandling/Totrinnskontroll/oppgaveForOpprettelseTyper';
import { AxiosRequestConfig } from 'axios';
import { useRerunnableEffect } from '../hooks/felles/useRerunnableEffect';
export interface IOppgaverForOpprettelse {
    hentOppgaverForOpprettelseCallback: {
        rerun: () => void;
    };
    oppgaverForOpprettelse: Ressurs<OppgaverForOpprettelseRequest>;
}

export interface OppgaverForOpprettelseRequest {
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}

export const useHentOppgaverForOpprettelse = (behandlingId: string): IOppgaverForOpprettelse => {
    const { axiosRequest } = useApp();

    const [oppgaverForOpprettelse, settOppgaverForOpprettelse] =
        useState<Ressurs<OppgaverForOpprettelseRequest>>(byggTomRessurs());

    const hentOppgaverForOpprettelseCallback = useRerunnableEffect(
        useCallback(() => {
            const behandlingConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `/familie-ef-sak/api/oppgaverforopprettelse/${behandlingId}`,
            };
            axiosRequest<OppgaverForOpprettelseRequest, null>(behandlingConfig).then(
                (res: Ressurs<OppgaverForOpprettelseRequest>) => settOppgaverForOpprettelse(res)
            );
        }, [axiosRequest, behandlingId]),
        [axiosRequest, behandlingId]
    );

    return {
        oppgaverForOpprettelse,
        hentOppgaverForOpprettelseCallback,
    };
};
