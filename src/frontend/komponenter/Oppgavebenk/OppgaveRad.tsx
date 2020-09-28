import React from 'react';
import { IOppgave } from './oppgave';

interface Props {
    oppgave: IOppgave;
}

const OppgaveRad: React.FC<Props> = ({ oppgave }) => {
    return (
        <tr>
            <td>{oppgave.opprettetTidspunkt}</td>
            <td>{oppgave.oppgavetype}</td>
            <td>Gjelder</td>
            <td>{oppgave.fristFerdigstillelse}</td>
            <td>Prioritet</td>
            <td>{oppgave.beskrivelse}</td>
            <td>{oppgave.identer[0].ident}</td> {/* TODO: VIL DETTE ALLTID FUNKE? */}
            <td>{oppgave.tildeltEnhetsnr}</td>
            <td>Saksbehandler</td>
            <td>Handlinger</td>
        </tr>
    );
};

export default OppgaveRad;
