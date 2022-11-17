import React, { useEffect, useState } from 'react';
import { IOppgave } from './typer/oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './typer/oppgavetema';
import {
    Behandlingstema,
    behandlingstemaTilTekst,
    OppgaveBehandlingstype,
    oppgaveBehandlingstypeTilTekst,
} from '../../App/typer/behandlingstema';
import { formaterIsoDato, formaterIsoDatoTid } from '../../App/utils/formatter';
import { useOppgave } from '../../App/hooks/useOppgave';
import { Handling } from './typer/handling';
import { Normaltekst } from 'nav-frontend-typografi';
import { IdentGruppe } from '@navikt/familie-typer/dist/oppgave';
import { Button, Popover } from '@navikt/ds-react';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import styled from 'styled-components';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

interface Props {
    oppgave: IOppgave;
    mapper: Record<number, string>;
    settFeilmelding: (feilmelding: string) => void;
}

const kanJournalføres = (oppgave: IOppgave) => {
    const { oppgavetype } = oppgave;

    return oppgavetype === 'JFR';
};

const måBehandlesIEFSak = (oppgave: IOppgave) => {
    const { behandlesAvApplikasjon, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'familie-ef-sak' &&
        oppgavetype &&
        ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'].includes(oppgavetype)
    );
};

const oppgaveErTilbakekreving = (oppgave: IOppgave) => {
    return (
        // oppgave.behandlingstema === 'ab0071' && //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver må denne sjekken inkluderes
        oppgave.behandlesAvApplikasjon === 'familie-tilbake' && oppgave.behandlingstype === 'ae0161'
    );
};

const oppgaveErKlage = (oppgave: IOppgave) =>
    oppgave.behandlesAvApplikasjon === 'familie-klage' && oppgave.behandlingstype === 'ae0058';

const oppgaveErJournalførKlage = (oppgave: IOppgave) =>
    oppgave.oppgavetype === 'JFR' && oppgave.behandlingstype === 'ae0058';

const oppgaveErVurderKonsekvensForYtelse = (oppgave: IOppgave) => {
    return oppgave.oppgavetype === 'VUR_KONS_YTE';
};

const utledHandling = (oppgave: IOppgave): Handling => {
    if (måBehandlesIEFSak(oppgave)) {
        return Handling.SAKSBEHANDLE;
    } else if (oppgaveErJournalførKlage(oppgave)) {
        return Handling.JOURNALFØR_KLAGE;
    } else if (kanJournalføres(oppgave)) {
        return Handling.JOURNALFØR;
    } else if (oppgaveErTilbakekreving(oppgave)) {
        return Handling.TILBAKE;
    } else if (oppgaveErKlage(oppgave)) {
        return Handling.KLAGE;
    } else if (oppgaveErVurderKonsekvensForYtelse(oppgave)) {
        return Handling.BEHANDLINGSOVERSIKT;
    }
    return Handling.INGEN;
};

const OppgaveRad: React.FC<Props> = ({ oppgave, mapper, settFeilmelding }) => {
    const {
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        laster,
        plukkOppgaveOgGåTilBehandlingsoversikt,
        feilmelding,
    } = useOppgave(oppgave);

    const { toggles } = useToggles();

    const [anker, settAnker] = useState<Element | null>(null);

    useEffect(() => {
        settFeilmelding(feilmelding);
    }, [feilmelding, settFeilmelding]);

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

    const typeBehandling = behandlingstype ? behandlingstype : behandlingstema;

    const utledetFolkeregisterIdent = oppgave.identer.filter(
        (i) => i.gruppe === IdentGruppe.FOLKEREGISTERIDENT
    )[0].ident;

    const utledKnappPåHandling = () => {
        switch (utledHandling(oppgave)) {
            case Handling.JOURNALFØR:
                return (
                    <TabellKnapp
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        onClick={() => gåTilJournalføring('stønad')}
                        disabled={laster}
                    >
                        Gå til journalpost
                    </TabellKnapp>
                );
            case Handling.JOURNALFØR_KLAGE:
                return (
                    <TabellKnapp
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        onClick={() => gåTilJournalføring('klage')}
                        disabled={laster || !toggles[ToggleName.journalføringKlage]}
                    >
                        Gå til journalpost (klage)
                    </TabellKnapp>
                );
            case Handling.SAKSBEHANDLE:
                return (
                    <TabellKnapp
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        onClick={gåTilBehandleSakOppgave}
                        disabled={laster}
                    >
                        Start Behandling
                    </TabellKnapp>
                );
            case Handling.TILBAKE:
            case Handling.BEHANDLINGSOVERSIKT:
            case Handling.KLAGE:
                return (
                    <TabellKnapp
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        onClick={() => {
                            plukkOppgaveOgGåTilBehandlingsoversikt(utledetFolkeregisterIdent);
                        }}
                        disabled={laster}
                    >
                        Gå til fagsak
                    </TabellKnapp>
                );
            default:
                return (
                    <Normaltekst style={{ marginLeft: '2.5rem' }}>Må håndteres i Gosys</Normaltekst>
                );
        }
    };

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
                <td>{utledetFolkeregisterIdent}</td>
                <td>{oppgave.tildeltEnhetsnr}</td>
                <td>{enhetsmappe}</td>
                <td>{oppgave.tilordnetRessurs || 'Ikke tildelt'}</td>
                <td>{utledKnappPåHandling()}</td>
            </tr>
        </>
    );
};

export default OppgaveRad;
