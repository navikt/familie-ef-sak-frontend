import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { OppgaveTypeForOpprettelse } from '../../Komponenter/Behandling/Totrinnskontroll/oppgaveForOpprettelseTyper';
import { AxiosRequestConfig } from 'axios';
import { useRerunnableEffect } from '../hooks/felles/useRerunnableEffect';
interface OppgaverForOpprettelseRequest {
    hentOppgaverForOpprettelseCallback: {
        rerun: () => void;
    };
    oppgaverForOpprettelse: Ressurs<OppgaverForOpprettelse>;
}

interface OppgaverForOpprettelse {
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}

export const useHentOppgaverForOpprettelse = (
    behandlingId: string
): OppgaverForOpprettelseRequest => {
    const { axiosRequest } = useApp();

    const [oppgaverForOpprettelse, settOppgaverForOpprettelse] =
        useState<Ressurs<OppgaverForOpprettelse>>(byggTomRessurs());

    const hentOppgaverForOpprettelseCallback = useRerunnableEffect(
        useCallback(() => {
            const behandlingConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `/familie-ef-sak/api/oppgaverforopprettelse/${behandlingId}`,
            };
            axiosRequest<OppgaverForOpprettelse, null>(behandlingConfig).then(
                (res: Ressurs<OppgaverForOpprettelse>) => settOppgaverForOpprettelse(res)
            );
        }, [axiosRequest, behandlingId]),
        [axiosRequest, behandlingId]
    );

    return {
        oppgaverForOpprettelse,
        hentOppgaverForOpprettelseCallback,
    };
};
