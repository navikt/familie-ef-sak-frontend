import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IOppgave } from '../../Komponenter/Oppgavebenk/typer/oppgave';
import { useEffect, useState } from 'react';
import { useHentFagsak } from './useHentFagsak';
import { Stønadstype } from '../typer/behandlingstema';
import {
    lagJournalføringKlageUrl,
    lagJournalføringUrl,
} from '../../Komponenter/Journalføring/journalføringUtil';

interface OppgaveDto {
    behandlingId: string;
    gsakId: string;
}

// eslint-disable-next-line
export const useOppgave = (oppgave: IOppgave) => {
    const { gåTilUrl, axiosRequest, innloggetSaksbehandler } = useApp();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);
    const { fagsak, hentFagsak } = useHentFagsak();

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            gåTilUrl(`/person/${fagsak.data.fagsakPersonId}`);
        }
    }, [fagsak, gåTilUrl]);

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
                settOppgaveTilSaksbehandler()
                    .then(() => gåTilUrl(`/behandling/${behandlingId}`))
                    .catch((error: Error) => {
                        settFeilmelding(error.message);
                    })
                    .finally(() => settLaster(false));
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    const gåTilJournalføring = (gjelderKlage = false) => {
        settLaster(true);
        const journalpostId = oppgave.journalpostId || '';
        const oppgaveId = oppgave.id || '';
        settOppgaveTilSaksbehandler()
            .then(() =>
                gåTilUrl(
                    gjelderKlage
                        ? lagJournalføringKlageUrl(journalpostId, oppgaveId)
                        : lagJournalføringUrl(journalpostId, oppgaveId)
                )
            )
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    const plukkOppgaveOgGåTilBehandlingsoversikt = (personIdent: string) => {
        settLaster(true);
        settOppgaveTilSaksbehandler()
            .then(() => hentFagsak(personIdent, Stønadstype.OVERGANGSSTØNAD)) //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver vi bruke behandlingstema til å sjekke stønadstype
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
        laster,
        plukkOppgaveOgGåTilBehandlingsoversikt,
    };
};
