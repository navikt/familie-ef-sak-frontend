import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { OppgaveTypeForOpprettelse } from '../../Komponenter/Behandling/Totrinnskontroll/oppgaveForOpprettelseTyper';
import { AxiosRequestConfig } from 'axios';

export interface IOppgaverForOpprettelse {
    hentOppgaverForOpprettelse: () => void;
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

    const hentOppgaverForOpprettelse = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/oppgaverforopprettelse/${behandlingId}`,
        };
        axiosRequest<OppgaverForOpprettelseRequest, null>(behandlingConfig).then(
            (res: Ressurs<OppgaverForOpprettelseRequest>) => settOppgaverForOpprettelse(res)
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        oppgaverForOpprettelse,
        hentOppgaverForOpprettelse,
    };
};
