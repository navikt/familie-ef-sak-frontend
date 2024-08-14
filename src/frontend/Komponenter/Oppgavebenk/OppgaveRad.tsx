import React, { useState } from 'react';
import { IOppgave } from './typer/oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './typer/oppgavetype';
import {
    Behandlingstema,
    behandlingstemaTilTekst,
    OppgaveBehandlingstype,
    oppgaveBehandlingstypeTilTekst,
} from '../../App/typer/behandlingstema';
import { formaterIsoDato, formaterIsoDatoTid } from '../../App/utils/formatter';
import { Popover, Table } from '@navikt/ds-react';
import { utledetFolkeregisterIdent } from './utils';
import { OppgaveKnapp } from './OppgaveKnapp';
import { TableDataCellSmall } from '../Personoversikt/HistorikkVedtaksperioder/vedtakshistorikkUtil';

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
            <Table.Row>
                <TableDataCellSmall onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
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
                </TableDataCellSmall>
                <TableDataCellSmall>{oppgavetype}</TableDataCellSmall>
                <TableDataCellSmall>{typeBehandling}</TableDataCellSmall>
                <TableDataCellSmall>{fristFerdigstillelseDato}</TableDataCellSmall>
                <TableDataCellSmall>{prioritet}</TableDataCellSmall>
                <TableDataCellSmall>{oppgave.beskrivelse}</TableDataCellSmall>
                <TableDataCellSmall>{utledetFolkeregisterIdent(oppgave)}</TableDataCellSmall>
                <TableDataCellSmall>{oppgave.tildeltEnhetsnr}</TableDataCellSmall>
                <TableDataCellSmall>{enhetsmappe}</TableDataCellSmall>
                <TableDataCellSmall>
                    <OppgaveKnapp
                        oppgave={oppgave}
                        hentOppgavePåNytt={hentOppgavePåNytt}
                        settFeilmelding={settFeilmelding}
                    />
                </TableDataCellSmall>
            </Table.Row>
        </>
    );
};

export default OppgaveRad;
