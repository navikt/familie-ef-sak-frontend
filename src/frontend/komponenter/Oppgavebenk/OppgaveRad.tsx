import React from 'react';
import parseISO from 'date-fns/parseJSON';
import { IOppgave } from './oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './oppgavetema';
import { parse } from 'date-fns';

interface Props {
    oppgave: IOppgave;
}

const OppgaveRad: React.FC<Props> = ({ oppgave }) => {
    const datoFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const regDato =
        oppgave.opprettetTidspunkt &&
        parseISO(oppgave.opprettetTidspunkt).toLocaleDateString('no-NO', datoFormat);

    const oppgavetype = oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype];

    const fristFerdigstillelseDato =
        oppgave.fristFerdigstillelse &&
        parse(oppgave.fristFerdigstillelse, 'yyyy-MM-dd', new Date()).toLocaleDateString(
            'no-NO',
            datoFormat
        );
    const prioritet = oppgave.prioritet && prioritetTilTekst[oppgave.prioritet];
    return (
        <tr>
            <td>{regDato}</td>
            <td>{oppgavetype}</td>
            <td>Gjelder</td>
            <td>{fristFerdigstillelseDato}</td>
            <td>{prioritet}</td>
            <td>{oppgave.beskrivelse}</td>
            <td>{oppgave.identer[0].ident}</td> {/* TODO: VIL DETTE ALLTID FUNKE? */}
            <td>{oppgave.tildeltEnhetsnr}</td>
            <td>Saksbehandler</td>
            <td>Handlinger</td>
        </tr>
    );
};

export default OppgaveRad;
