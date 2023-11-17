import { erAvTypeFeil, RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IOppgave } from '../../Komponenter/Oppgavebenk/typer/oppgave';
import { useEffect, useState } from 'react';
import { useHentFagsak } from './useHentFagsak';
import { Stønadstype } from '../typer/behandlingstema';
import {
    lagJournalføringKlageUrl,
    lagJournalføringUrl,
} from '../../Komponenter/Journalføring/Felles/utils';
import { useNavigate } from 'react-router-dom';
import { ToggleName } from '../context/toggles';
import { useToggles } from '../context/TogglesContext';

interface OppgaveDto {
    behandlingId: string;
    gsakId: string;
}

export const useOppgave = (oppgave: IOppgave) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();
    const { toggles } = useToggles();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);
    const { fagsak, hentFagsak } = useHentFagsak();

    const settOppgaveTilSaksbehandler = () => {
        settLaster(true);
        return axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}/fordel?saksbehandler=${innloggetSaksbehandler?.navIdent}`,
            params: oppgave.versjon && {
                versjon: oppgave.versjon,
            },
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(
                        new Error(`Feilet fordeling av oppgave. Feil: ${res.frontendFeilmelding}`)
                    );
                }
            })
            .finally(() => settLaster(false));
    };

    const gåTilBehandleSakOppgave = () => {
        if (laster) return;
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
                navigate(`/behandling/${behandlingId}`);
            })
            .catch((error: Error) => {
                settFeilmelding(error.message);
            })
            .finally(() => settLaster(false));
    };

    const gåTilJournalføring = (type: 'klage' | 'stønad') => {
        const journalpostId = oppgave.journalpostId || '';
        const oppgaveId = oppgave.id || '';
        if (toggles[ToggleName.visNyJournalføring]) {
            navigate(lagJournalføringUrl(journalpostId, oppgaveId));
        } else {
            navigate(
                type === 'klage'
                    ? lagJournalføringKlageUrl(journalpostId, oppgaveId)
                    : lagJournalføringUrl(journalpostId, oppgaveId)
            );
        }
    };

    const hentFagsakOgTriggRedirectTilBehandlingsoversikt = (personIdent: string) => {
        hentFagsak(personIdent, Stønadstype.OVERGANGSSTØNAD); //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver vi bruke behandlingstema til å sjekke stønadstype
    };

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            navigate(`/person/${fagsak.data.fagsakPersonId}`);
        } else if (erAvTypeFeil(fagsak)) {
            settFeilmelding(
                'Henting av fagsak feilet, prøv på nytt. Feil: ' +
                    (fagsak.frontendFeilmelding || fagsak.errorMelding || 'Ukjent feil')
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fagsak]);

    const tilbakestillFordeling = () => {
        settLaster(true);
        return axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}/tilbakestill`,
            params: oppgave.versjon && {
                versjon: oppgave.versjon,
            },
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(
                        new Error(`Feilet fordeling av oppgave. Feil: ${res.frontendFeilmelding}`)
                    );
                }
            })
            .finally(() => settLaster(false));
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
