import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import {
    IOppgaverForOpprettelse,
    OppgaveForOpprettelseType,
} from '../../Komponenter/Behandling/Totrinnskontroll/OppgaverForOpprettelse';

export interface OppgaverForOpprettelseState {
    feilmelding: string | undefined;
    hentOppgaverForOpprettelse: (behandlingId: string) => void;
    oppgaverForOpprettelse: IOppgaverForOpprettelse;
    oppdaterOppgavetyperSomSkalOpprettes: (typer: OppgaveForOpprettelseType[]) => void;
}

const initialState: IOppgaverForOpprettelse = {
    oppgavetyperSomSkalOpprettes: [],
    oppgavetyperSomKanOpprettes: [],
};

const feilmeldingPrefiks =
    'Noe gikk galt under henting av oppgaver som kan opprettes. Forsøk å last siden på nytt. ';
export const useHentOppgaverForOpprettelse = (): OppgaverForOpprettelseState => {
    const { axiosRequest } = useApp();
    const [oppgaverForOpprettelse, settOppgaverForOpprettelse] =
        useState<IOppgaverForOpprettelse>(initialState);
    const [feilmelding, settFeilmelding] = useState<string>();

    const hentOppgaverForOpprettelse = useCallback(
        (behandlingId: string) => {
            settFeilmelding(undefined);
            axiosRequest<IOppgaverForOpprettelse, undefined>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgaverforopprettelse/${behandlingId}`,
            }).then((res: RessursSuksess<IOppgaverForOpprettelse> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settOppgaverForOpprettelse(res.data);
                } else {
                    settFeilmelding(feilmeldingPrefiks + res.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    const oppdaterOppgavetyperSomSkalOpprettes = (
        oppgavetyperSomSkalOpprettes: OppgaveForOpprettelseType[]
    ) => {
        settOppgaverForOpprettelse((prevState) => ({
            ...prevState,
            oppgavetyperSomSkalOpprettes,
        }));
    };

    return {
        feilmelding,
        hentOppgaverForOpprettelse,
        oppgaverForOpprettelse,
        oppdaterOppgavetyperSomSkalOpprettes,
    };
};
