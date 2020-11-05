import React from 'react';
import { IOppgave } from './oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './oppgavetema';
import { enhetsmappeTilTekst } from './enhetsmappe';
import { Behandlingstema, behandlingstemaTilTekst } from '../../typer/behandlingstema';
import { useHistory } from 'react-router-dom';
import { formaterIsoDato } from '../../utils/formatter';
import { Flatknapp } from 'nav-frontend-knapper';
import { useApp } from '../../context/AppContext';
import { Ressurs, RessursStatus } from '../../typer/ressurs';

interface Props {
    oppgave: IOppgave;
    settFeilmelding: (melding: string) => void;
}

interface OppgaveDto {
    behandlingId: string;
    gsakId: string;
}

const OppgaveRad: React.FC<Props> = ({ oppgave, settFeilmelding }) => {
    const regDato = oppgave.opprettetTidspunkt && formaterIsoDato(oppgave.opprettetTidspunkt);
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const history = useHistory();

    const oppgavetype = oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype];

    const fristFerdigstillelseDato =
        oppgave.fristFerdigstillelse && formaterIsoDato(oppgave.fristFerdigstillelse);

    const prioritet = oppgave.prioritet && prioritetTilTekst[oppgave.prioritet];
    const enhetsmappe = oppgave.mappeId && enhetsmappeTilTekst[oppgave.mappeId];
    const behandlingstema =
        oppgave.behandlingstema &&
        behandlingstemaTilTekst[oppgave.behandlingstema as Behandlingstema];

    const kanJournalføres =
        oppgave.oppgavetype === 'JFR' &&
        oppgave.behandlingstema &&
        ['ab0071', 'ab0177', 'ab0028'].includes(oppgave.behandlingstema);

    const kanBehandles =
        oppgave.oppgavetype === 'BEH_SAK' &&
        oppgave.behandlingstema &&
        ['ab0071', 'ab0177', 'ab0028'].includes(oppgave.behandlingstema);

    const gåTilBehandleSakOppgave = () => {
        axiosRequest<OppgaveDto, { oppgaveId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}`,
        }).then((res: Ressurs<OppgaveDto>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    settOppgaveTilSaksbehandler(oppgave.id, innloggetSaksbehandler?.navIdent).then(
                        (erOppgaveOppdatert: boolean) => {
                            if (erOppgaveOppdatert) {
                                history.push(`/behandling/${res.data.behandlingId}`);
                            }
                        }
                    );
                    break;
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                case RessursStatus.FEILET:
                    settFeilmelding(res.frontendFeilmelding);
                    break;
                default:
                    break;
            }
        });
    };

    const settOppgaveTilSaksbehandler = (oppgaveId: number, saksbehandlerId?: string) => {
        return axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/oppgave/${oppgaveId}/fordel?saksbehandler=${saksbehandlerId}`,
        }).then((res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                case RessursStatus.FEILET:
                    settFeilmelding(res.frontendFeilmelding);
                    return false;
                default:
                    return true;
            }
        });
    };

    const gåTilJournalføring = () => {
        settOppgaveTilSaksbehandler(oppgave.id, innloggetSaksbehandler?.navIdent).then(
            (erOppgaveOppdatert: boolean) => {
                if (erOppgaveOppdatert) {
                    history.push(
                        `/journalfor?journalpostId=${oppgave.journalpostId}&oppgaveId=${oppgave.id}`
                    );
                }
            }
        );
    };

    return (
        <tr>
            <td>{regDato}</td>
            <td>{oppgavetype}</td>
            <td>{behandlingstema}</td>
            <td>{fristFerdigstillelseDato}</td>
            <td>{prioritet}</td>
            <td>{oppgave.beskrivelse}</td>
            <td>{oppgave.identer && oppgave.identer[0].ident}</td>
            <td>{oppgave.tildeltEnhetsnr}</td>
            <td>{enhetsmappe}</td>
            <td>{oppgave.tilordnetRessurs || 'Ikke tildelt'}</td>
            <td>
                {kanJournalføres && (
                    <Flatknapp onClick={gåTilJournalføring}>Gå til journalpost</Flatknapp>
                )}
                {kanBehandles && (
                    <Flatknapp onClick={gåTilBehandleSakOppgave}>Behandle sak</Flatknapp>
                )}
            </td>
        </tr>
    );
};

export default OppgaveRad;
