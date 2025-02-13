import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { byggTomRessurs, byggHenterRessurs, Ressurs } from '../typer/ressurs';
import { OppgaveTypeForOpprettelse } from '../../Komponenter/Behandling/Totrinnskontroll/oppgaveForOpprettelseTyper';
import { useRerunnableEffect } from './felles/useRerunnableEffect';

interface OppgaverForOpprettelse {
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}

export interface Oppfølgingsoppgave {
    behandlingid: string;
    oppgaverForOpprettelse: OppgaverForOpprettelse;
    oppgaveIderForFerdigstilling: number[];
}

export const useHentOppfølgingsoppgave = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [oppfølgingsoppgave, settOppfølgingsoppgave] =
        useState<Ressurs<Oppfølgingsoppgave>>(byggTomRessurs());

    const hentOppfølgingsoppgave = useRerunnableEffect(
        useCallback(() => {
            settOppfølgingsoppgave(byggHenterRessurs());
            axiosRequest<Oppfølgingsoppgave, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppfolgingsoppgave/${behandlingId}`,
            }).then((res: Ressurs<Oppfølgingsoppgave>) => {
                settOppfølgingsoppgave(res);
            });
        }, [axiosRequest, behandlingId]),
        [axiosRequest, behandlingId]
    );

    return {
        hentOppfølgingsoppgave,
        oppfølgingsoppgave,
    };
};
