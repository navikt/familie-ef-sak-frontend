import { erAvTypeFeil, RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IOppgave } from '../../Komponenter/Oppgavebenk/typer/oppgave';
import { useEffect, useState } from 'react';
import { useHentFagsak } from './useHentFagsak';
import { Stønadstype } from '../typer/behandlingstema';
import {
    lagJournalføringKlageUrl,
    lagJournalføringUrl,
} from '../../Komponenter/Journalføring/utils';

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

    const settOppgaveTilSaksbehandler = () => {
        return axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}/fordel?saksbehandler=${innloggetSaksbehandler?.navIdent}`,
            params: oppgave.versjon && {
                versjon: oppgave.versjon,
            },
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                return Promise.resolve();
            } else {
                return Promise.reject(
                    new Error(`Feilet fordeling av oppgave. Feil: ${res.frontendFeilmelding}`)
                );
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
                    settFeilmelding(res.frontendFeilmelding);
                    return reject(new Error(res.frontendFeilmelding));
                });
            })
            .then((behandlingId) => {
                gåTilUrl(`/behandling/${behandlingId}`);
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    const gåTilJournalføring = (type: 'klage' | 'stønad') => {
        const journalpostId = oppgave.journalpostId || '';
        const oppgaveId = oppgave.id || '';

        gåTilUrl(
            type === 'klage'
                ? lagJournalføringKlageUrl(journalpostId, oppgaveId)
                : lagJournalføringUrl(journalpostId, oppgaveId)
        );
    };

    const hentFagsakOgTriggRedirectTilBehandlingsoversikt = (personIdent: string) => {
        hentFagsak(personIdent, Stønadstype.OVERGANGSSTØNAD); //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver vi bruke behandlingstema til å sjekke stønadstype
    };

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            gåTilUrl(`/person/${fagsak.data.fagsakPersonId}`);
        } else if (erAvTypeFeil(fagsak)) {
            settFeilmelding(
                'Henting av fagsak feilet, prøv på nytt. Feil: ' +
                    (fagsak.frontendFeilmelding || fagsak.errorMelding || 'Ukjent feil')
            );
        }
    }, [fagsak, gåTilUrl]);

    const tilbakestillFordeling = () => {
        return axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}/tilbakestill`,
            params: oppgave.versjon && {
                versjon: oppgave.versjon,
            },
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                return Promise.resolve();
            } else {
                return Promise.reject(
                    new Error(`Feilet fordeling av oppgave. Feil: ${res.frontendFeilmelding}`)
                );
            }
        });
    };

    return {
        feilmelding,
        settFeilmelding,
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        laster,
        hentFagsakOgTriggRedirectTilBehandlingsoversikt,
        tilbakestillFordeling,
        settOppgaveTilSaksbehandler,
    };
};
