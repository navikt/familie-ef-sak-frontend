import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState, useEffect } from 'react';
import { OppgaveTypeForOpprettelse } from '../../Komponenter/Behandling/Totrinnskontroll/oppgaveForOpprettelseTyper';

export interface IOppgaverForOpprettelse {
    feilmelding: string | undefined;
    hentOppgaverForOpprettelse: (behandlingId: string) => void;
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    settOppgavetyperSomSkalOpprettes: React.Dispatch<
        React.SetStateAction<OppgaveTypeForOpprettelse[]>
    >;
}

interface OppgaverForOpprettelseRequest {
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}

export const useHentOppgaverForOpprettelse = (behandlingId: string): IOppgaverForOpprettelse => {
    const { axiosRequest } = useApp();
    const [oppgavetyperSomKanOpprettes, settOppgavetyperSomKanOpprettes] = useState<
        OppgaveTypeForOpprettelse[]
    >([]);
    const [oppgavetyperSomSkalOpprettes, settOppgavetyperSomSkalOpprettes] = useState<
        OppgaveTypeForOpprettelse[]
    >([]);
    const [feilmelding, settFeilmelding] = useState<string>();

    const hentOppgaverForOpprettelse = useCallback(
        (behandlingId: string) => {
            settFeilmelding(undefined);
            axiosRequest<OppgaverForOpprettelseRequest, undefined>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgaverforopprettelse/${behandlingId}`,
            }).then((res: RessursSuksess<OppgaverForOpprettelseRequest> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settOppgavetyperSomSkalOpprettes(res.data.oppgavetyperSomSkalOpprettes);
                    settOppgavetyperSomKanOpprettes(res.data.oppgavetyperSomKanOpprettes);
                } else {
                    settFeilmelding(
                        'Noe gikk galt under henting av oppgaver som kan opprettes. Forsøk å last siden på nytt. ' +
                            res.frontendFeilmelding
                    );
                }
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        hentOppgaverForOpprettelse(behandlingId);
    }, [behandlingId, hentOppgaverForOpprettelse]);

    return {
        feilmelding,
        hentOppgaverForOpprettelse,
        oppgavetyperSomKanOpprettes,
        oppgavetyperSomSkalOpprettes,
        settOppgavetyperSomSkalOpprettes,
    };
};
