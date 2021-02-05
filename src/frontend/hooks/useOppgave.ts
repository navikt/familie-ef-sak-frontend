import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useHistory } from 'react-router-dom';
import { IOppgave } from '../komponenter/Oppgavebenk/oppgave';
import { useState } from 'react';

interface OppgaveDto {
    behandlingId: string;
    gsakId: string;
}

export const useOppgave = (oppgave: IOppgave) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const history = useHistory();
    const [feilmelding, settFeilmelding] = useState<string>();

    const settOppgaveTilSaksbehandler = () => {
        return axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}/fordel?saksbehandler=${innloggetSaksbehandler?.navIdent}`,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(res.frontendFeilmelding));
            }
        });
    };

    const gåTilBehandleSakOppgave = () => {
        axiosRequest<OppgaveDto, { oppgaveId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}`,
        })
            .then((res: RessursSuksess<OppgaveDto> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    return Promise.resolve(res.data.behandlingId);
                }
                return Promise.reject(new Error(res.frontendFeilmelding));
            })
            .then((behandlingId) => {
                settOppgaveTilSaksbehandler().then(() =>
                    history.push(`/behandling/${behandlingId}`)
                );
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
            });
    };

    const gåTilJournalføring = () => {
        settOppgaveTilSaksbehandler()
            .then(() =>
                history.push(
                    `/journalfor?journalpostId=${oppgave.journalpostId}&oppgaveId=${oppgave.id}`
                )
            )
            .catch((error: Error) => {
                settFeilmelding(error.message);
            });
    };

    return {
        feilmelding,
        settFeilmelding,
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
    };
};
