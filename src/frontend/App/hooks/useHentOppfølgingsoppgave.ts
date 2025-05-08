import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import { OppgaveTypeForOpprettelse } from '../../Komponenter/Behandling/Totrinnskontroll/oppgaveForOpprettelseTyper';
import { useRerunnableEffect } from './felles/useRerunnableEffect';
import { AutomatiskBrevValg } from '../../Komponenter/Behandling/Totrinnskontroll/AutomatiskBrev';

interface OppgaverForOpprettelse {
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}

export interface Oppfølgingsoppgave {
    behandlingid: string;
    oppgaverForOpprettelse: OppgaverForOpprettelse;
    oppgaveIderForFerdigstilling: number[];
    automatiskBrev: AutomatiskBrevValg[];
}

export const useHentOppfølgingsoppgave = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [oppfølgingsoppgave, settOppfølgingsoppgave] = useState<Oppfølgingsoppgave>();
    const [feilmelding, settFeilmelding] = useState<string>('');

    const hentOppfølgingsoppgave = useRerunnableEffect(
        useCallback(() => {
            axiosRequest<Oppfølgingsoppgave, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppfolgingsoppgave/${behandlingId}`,
            }).then((res: Ressurs<Oppfølgingsoppgave>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settOppfølgingsoppgave(res.data);
                } else if (res.status === RessursStatus.FEILET) {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        }, [axiosRequest, behandlingId]),
        [axiosRequest, behandlingId]
    );

    return {
        hentOppfølgingsoppgave,
        oppfølgingsoppgave,
        feilmelding,
    };
};
