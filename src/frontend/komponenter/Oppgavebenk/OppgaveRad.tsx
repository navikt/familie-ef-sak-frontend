import React, { useState } from 'react';
import { IOppgave } from './oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './oppgavetema';
import { enhetsmappeTilTekst } from './enhetsmappe';
import { Behandlingstema, behandlingstemaTilTekst } from '../../typer/behandlingstema';
import { Link, Redirect } from 'react-router-dom';
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
    const { axiosRequest } = useApp();
    const [redirectTilSaksbehandling, settRedirectTilSaksbehandling] = useState<boolean>(false);

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
        oppgave.oppgavetype ===
        'BEH_SAK'; /*&&
        oppgave.behandlingstema &&
        ['ab0071', 'ab0177', 'ab0028'].includes(oppgave.behandlingstema);*/

    const sjekkGyldigOppgave = () => {
        axiosRequest<OppgaveDto, { oppgaveId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${oppgave.id}`,
        }).then((res: Ressurs<OppgaveDto>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settRedirectTilSaksbehandling(true);
            } else if (res.status === RessursStatus.FUNKSJONELL_FEIL) {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
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
                    <Link
                        to={`/journalfor?journalpostId=${oppgave.journalpostId}&oppgaveId=${oppgave.id}`}
                    >
                        Gå til journalpost
                    </Link>
                )}
                {kanBehandles && <Flatknapp onClick={sjekkGyldigOppgave}>Behandle sak</Flatknapp>}
                {redirectTilSaksbehandling && (
                    <Redirect
                        to={`/saksbehandling?oppgaveId=${oppgave.id}`}
                    /> /* TODO Mangler riktig path*/
                )}
            </td>
        </tr>
    );
};

export default OppgaveRad;
