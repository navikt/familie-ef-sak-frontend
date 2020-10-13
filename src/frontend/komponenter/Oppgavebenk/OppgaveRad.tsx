import React from 'react';
import { IOppgave } from './oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './oppgavetema';
import { enhetsmappeTilTekst } from './enhetsmappe';
import { Behandlingstema, behandlingstemaTilTekst } from '../../typer/behandlingstema';
import { Link } from 'react-router-dom';
import { tilLokalDatoStreng } from '../../utils/date';

interface Props {
    oppgave: IOppgave;
}

const OppgaveRad: React.FC<Props> = ({ oppgave }) => {
    const regDato = oppgave.opprettetTidspunkt && tilLokalDatoStreng(oppgave.opprettetTidspunkt);

    const oppgavetype = oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype];

    const fristFerdigstillelseDato =
        oppgave.fristFerdigstillelse && tilLokalDatoStreng(oppgave.fristFerdigstillelse);

    const prioritet = oppgave.prioritet && prioritetTilTekst[oppgave.prioritet];
    const enhetsmappe = oppgave.mappeId && enhetsmappeTilTekst[oppgave.mappeId];
    const behandlingstema =
        oppgave.behandlingstema &&
        behandlingstemaTilTekst[oppgave.behandlingstema as Behandlingstema];
    return (
        <tr>
            <td>{regDato}</td>
            <td>{oppgavetype}</td>
            <td>{behandlingstema}</td>
            <td>{fristFerdigstillelseDato}</td>
            <td>{prioritet}</td>
            <td>{oppgave.beskrivelse}</td>
            <td>{oppgave.identer[0].ident}</td> {/* TODO: VIL DETTE ALLTID FUNKE? */}
            <td>{oppgave.tildeltEnhetsnr}</td>
            <td>{enhetsmappe}</td>
            <td>{oppgave.tilordnetRessurs || 'Ikke tildelt'}</td>
            <td>
                <Link
                    to={`/journalfor?journalpostId${oppgave.journalpostId}&oppgaveId=${oppgave.id}`}
                >
                    Gå til journalpost
                </Link>
            </td>
        </tr>
    );
};

export default OppgaveRad;
