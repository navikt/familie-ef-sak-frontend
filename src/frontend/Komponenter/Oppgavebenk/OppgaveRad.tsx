import React, { useState } from 'react';
import { IOppgave } from './typer/oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './typer/oppgavetema';
import {
    Behandlingstema,
    behandlingstemaTilTekst,
    OppgaveBehandlingstype,
    oppgaveBehandlingstypeTilTekst,
} from '../../App/typer/behandlingstema';
import { formaterIsoDato, formaterIsoDatoTid } from '../../App/utils/formatter';
import { Popover } from '@navikt/ds-react';
import { utledetFolkeregisterIdent } from './utils';
import { OppgaveKnapp } from './OppgaveKnapp';

interface Props {
    oppgave: IOppgave;
    mapper: Record<number, string>;
    settFeilmelding: (feilmelding: string) => void;
    hentOppgavePåNytt: () => void;
}

const OppgaveRad: React.FC<Props> = ({ oppgave, mapper, settFeilmelding, hentOppgavePåNytt }) => {
    const [anker, settAnker] = useState<Element | null>(null);

    const togglePopover = (element: React.MouseEvent<HTMLElement>) => {
        settAnker(anker ? null : element.currentTarget);
    };

    const regDato = oppgave.opprettetTidspunkt && formaterIsoDato(oppgave.opprettetTidspunkt);
    const regDatoMedKlokkeslett =
        oppgave.opprettetTidspunkt && formaterIsoDatoTid(oppgave.opprettetTidspunkt);

    const oppgavetype = oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype];

    const fristFerdigstillelseDato =
        oppgave.fristFerdigstillelse && formaterIsoDato(oppgave.fristFerdigstillelse);

    const prioritet = oppgave.prioritet && prioritetTilTekst[oppgave.prioritet];
    const enhetsmappe = oppgave.mappeId && mapper[oppgave.mappeId];

    const behandlingstema =
        oppgave.behandlingstema &&
        behandlingstemaTilTekst[oppgave.behandlingstema as Behandlingstema];

    const behandlingstype =
        oppgave.behandlingstype &&
        oppgaveBehandlingstypeTilTekst[oppgave.behandlingstype as OppgaveBehandlingstype];

    const typeBehandling = behandlingstype
        ? behandlingstema
            ? behandlingstype + ' - ' + behandlingstema
            : behandlingstype
        : behandlingstema;

    return (
        <>
            <tr>
                <td onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
                    {regDato}
                    <Popover
                        id={`registreringstidspunkt-for-oppgave-${oppgave.id}`}
                        anchorEl={anker}
                        open={!!anker}
                        onClose={() => settAnker(null)}
                        placement={'right'}
                        tabIndex={-1}
                    >
                        <Popover.Content>
                            Registreringstidspunkt: {regDatoMedKlokkeslett}
                        </Popover.Content>
                    </Popover>
                </td>
                <td>{oppgavetype}</td>
                <td>{typeBehandling}</td>
                <td>{fristFerdigstillelseDato}</td>
                <td>{prioritet}</td>
                <td>{oppgave.beskrivelse}</td>
                <td>{utledetFolkeregisterIdent(oppgave)}</td>
                <td>{oppgave.tildeltEnhetsnr}</td>
                <td>{enhetsmappe}</td>
                <td>
                    <OppgaveKnapp
                        oppgave={oppgave}
                        hentOppgavePåNytt={hentOppgavePåNytt}
                        settFeilmelding={settFeilmelding}
                    />
                </td>
            </tr>
        </>
    );
};

export default OppgaveRad;
