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
import { Flatknapp as Knapp } from 'nav-frontend-knapper';
import hiddenIf from '../../Felles/HiddenIf/hiddenIf';
import { useOppgave } from '../../App/hooks/useOppgave';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import styled from 'styled-components';
import { Handling } from './typer/handling';
import { Normaltekst } from 'nav-frontend-typografi';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName, Toggles } from '../../App/context/toggles';

interface Props {
    oppgave: IOppgave;
    mapper: Record<number, string>;
    settFeilmelding: (feilmelding: string) => void;
}

const StyledPopoverinnhold = styled.p`
    margin: 1rem;
`;

const Flatknapp = hiddenIf(Knapp);

const kanJournalføres = (oppgave: IOppgave) => {
    const { behandlesAvApplikasjon, behandlingstema, oppgavetype } = oppgave;
    return (
        (behandlesAvApplikasjon === 'familie-ef-sak-førstegangsbehandling' ||
            behandlesAvApplikasjon === 'familie-ef-sak') &&
        oppgavetype === 'JFR' &&
        behandlingstema &&
        ['ab0071'].includes(behandlingstema)
    );
};

const måBehandlesIEFSak = (oppgave: IOppgave) => {
    const { behandlesAvApplikasjon, behandlingstema, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'familie-ef-sak' &&
        oppgavetype &&
        ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'].includes(oppgavetype) &&
        behandlingstema &&
        ['ab0071'].includes(behandlingstema)
    );
};
const kanStarteBlankettBehandling = (oppgave: IOppgave) => {
    return (
        oppgave.behandlesAvApplikasjon === 'familie-ef-sak-blankett' &&
        oppgave.behandlingstema === 'ab0071'
    );
};

const oppgaveErTilbakekreving = (oppgave: IOppgave) => {
    return (
        // oppgave.behandlingstema === 'ab0071' && //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver må denne sjekken inkluderes
        oppgave.behandlesAvApplikasjon === 'familie-tilbake' && oppgave.behandlingstype === 'ae0161'
    );
};

const kanMigreres = (oppgave: IOppgave) => {
    return (
        oppgave.behandlesAvApplikasjon === '' &&
        oppgave.oppgavetype === 'JFR' &&
        oppgave.behandlingstema === 'ab0071'
    );
};

const utledHandling = (oppgave: IOppgave, toggles: Toggles): Handling => {
    if (måBehandlesIEFSak(oppgave)) {
        return Handling.SAKSBEHANDLE;
    } else if (kanJournalføres(oppgave)) {
        return Handling.JOURNALFØR;
    } else if (kanStarteBlankettBehandling(oppgave)) {
        return Handling.BLANKETT;
    } else if (oppgaveErTilbakekreving(oppgave)) {
        return Handling.TILBAKE;
    } else if (kanMigreres(oppgave) && toggles[ToggleName.oppgavebenkMigrerFagsak]) {
        return Handling.JOURNALFØR_MIGRERING;
    }
    return Handling.INGEN;
};

const OppgaveRad: React.FC<Props> = ({ oppgave, mapper, settFeilmelding }) => {
    const { toggles } = useToggles();
    const {
        gåTilBehandleSakOppgave,
        gåTilVurderMigrering,
        gåTilJournalføring,
        startBlankettBehandling,
        laster,
        gåTilFagsak,
        feilmelding,
    } = useOppgave(oppgave);

    const [anker, settAnker] = useState<HTMLElement>();

    useEffect(() => {
        settFeilmelding(feilmelding);
    }, [feilmelding, settFeilmelding]);

    const togglePopover = (element: React.MouseEvent<HTMLElement>) => {
        settAnker(anker ? undefined : element.currentTarget);
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
        ? `${behandlingstype} (${behandlingstema})`
        : behandlingstema;

    const utledKnappPåHandling = () => {
        switch (utledHandling(oppgave, toggles)) {
            case Handling.BLANKETT:
                return (
                    <Flatknapp onClick={startBlankettBehandling} disabled={laster}>
                        Lag blankett
                    </Flatknapp>
                );
            case Handling.JOURNALFØR:
                return (
                    <Flatknapp onClick={gåTilJournalføring} disabled={laster}>
                        Gå til journalpost
                    </Flatknapp>
                );
            case Handling.SAKSBEHANDLE:
                return (
                    <Flatknapp onClick={gåTilBehandleSakOppgave} disabled={laster}>
                        Start Behandling
                    </Flatknapp>
                );
            case Handling.TILBAKE:
                return (
                    <Flatknapp
                        onClick={() => gåTilFagsak(oppgave.identer && oppgave.identer[0].ident)}
                        disabled={laster}
                    >
                        Gå til fagsak
                    </Flatknapp>
                );
            case Handling.JOURNALFØR_MIGRERING:
                return (
                    <Flatknapp onClick={gåTilVurderMigrering} disabled={laster}>
                        Journalfør (migrering)
                    </Flatknapp>
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
                        ankerEl={anker}
                        onRequestClose={() => settAnker(undefined)}
                        orientering={PopoverOrientering.Hoyre}
                        autoFokus={false}
                        tabIndex={-1}
                    >
                        <StyledPopoverinnhold>
                            Registreringstidspunkt: {regDatoMedKlokkeslett}
                        </StyledPopoverinnhold>
                    </Popover>
                </td>
                <td>{oppgavetype}</td>
                <td>{typeBehandling}</td>
                <td>{fristFerdigstillelseDato}</td>
                <td>{prioritet}</td>
                <td>{oppgave.beskrivelse}</td>
                <td>{oppgave.identer && oppgave.identer[0].ident}</td>
                <td>{oppgave.tildeltEnhetsnr}</td>
                <td>{enhetsmappe}</td>
                <td>{oppgave.tilordnetRessurs || 'Ikke tildelt'}</td>
                <td>{utledKnappPåHandling()}</td>
            </tr>
        </>
    );
};

export default OppgaveRad;
