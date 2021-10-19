import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IOppgave } from '../../Komponenter/Oppgavebenk/typer/oppgave';
import { useState } from 'react';

interface OppgaveDto {
    behandlingId: string;
    gsakId: string;
}

// eslint-disable-next-line
export const useOppgave = (oppgave: IOppgave) => {
    const { gåTilUrl, axiosRequest, innloggetSaksbehandler } = useApp();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

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
        settLaster(true);
        axiosRequest<OppgaveDto, { oppgaveId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}`,
        })
            .then((res: RessursSuksess<OppgaveDto> | RessursFeilet) => {
                return new Promise((resolve, reject) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        return resolve(res.data.behandlingId);
                    }
                    return reject(new Error(res.frontendFeilmelding));
                });
            })
            .then((behandlingId) => {
                settOppgaveTilSaksbehandler().then(() => gåTilUrl(`/behandling/${behandlingId}`));
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    const startBlankettBehandling = () => {
        settLaster(true);
        axiosRequest<string, { oppgaveId: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/blankett/oppgave/${oppgave.id}`,
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                return new Promise((resolve, reject) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        return resolve(res.data);
                    }
                    return reject(new Error(res.frontendFeilmelding));
                });
            })
            .then((behandlingId) => {
                settOppgaveTilSaksbehandler().then(() => gåTilUrl(`/behandling/${behandlingId}`));
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    const gåTilJournalføring = () => {
        settLaster(true);
        settOppgaveTilSaksbehandler()
            .then(() =>
                gåTilUrl(
                    `/journalfor?journalpostId=${oppgave.journalpostId}&oppgaveId=${oppgave.id}`
                )
            )
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    return {
        feilmelding,
        settFeilmelding,
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        startBlankettBehandling,
        laster,
    };
};
