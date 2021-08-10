import React, { useState } from 'react';
import { IOppgave } from './typer/oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './typer/oppgavetema';
import { enhetsmappeTilTekst } from './typer/enhetsmappe';
import { Behandlingstema, behandlingstemaTilTekst } from '../../App/typer/behandlingstema';
import { formaterIsoDato, formaterIsoDatoTid } from '../../App/utils/formatter';
import { Flatknapp as Knapp } from 'nav-frontend-knapper';
import UIModalWrapper from '../../Felles/Modal/UIModalWrapper';
import { Normaltekst } from 'nav-frontend-typografi';
import hiddenIf from '../../Felles/HiddenIf/hiddenIf';
import { useOppgave } from '../../App/hooks/useOppgave';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import styled from 'styled-components';

interface Props {
    oppgave: IOppgave;
}

const StyledPopoverinnhold = styled.p`
    margin: 1rem;
`;
const Flatknapp = hiddenIf(Knapp);

const kanJournalføres = (oppgave: IOppgave) => {
    const { behandlesAvApplikasjon, behandlingstema, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'familie-ef-sak-førstegangsbehandling' &&
        oppgavetype === 'JFR' &&
        behandlingstema &&
        ['ab0071', 'ab0177', 'ab0028'].includes(behandlingstema)
    );
};

const måBehandlesIEFSak = (oppgave: IOppgave) => {
    const { behandlesAvApplikasjon, behandlingstema, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'familie-ef-sak' &&
        oppgavetype &&
        ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'].includes(oppgavetype) &&
        behandlingstema &&
        ['ab0071', 'ab0177', 'ab0028'].includes(behandlingstema)
    );
};

const OppgaveRad: React.FC<Props> = ({ oppgave }) => {
    const {
        feilmelding,
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        startBlankettBehandling,
        settFeilmelding,
        laster,
    } = useOppgave(oppgave);

    const [anker, settAnker] = useState<HTMLElement>();

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
    const enhetsmappe = oppgave.mappeId && enhetsmappeTilTekst[oppgave.mappeId];

    const behandlingstema =
        oppgave.behandlingstema &&
        behandlingstemaTilTekst[oppgave.behandlingstema as Behandlingstema];

    const kanStarteBlankettBehandling =
        oppgave.behandlesAvApplikasjon === 'familie-ef-sak-blankett';

    const måHåndteresIGosys =
        !måBehandlesIEFSak(oppgave) && !kanJournalføres(oppgave) && !kanStarteBlankettBehandling;

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
                <td>{behandlingstema}</td>
                <td>{fristFerdigstillelseDato}</td>
                <td>{prioritet}</td>
                <td>{oppgave.beskrivelse}</td>
                <td>{oppgave.identer && oppgave.identer[0].ident}</td>
                <td>{oppgave.tildeltEnhetsnr}</td>
                <td>{enhetsmappe}</td>
                <td>{oppgave.tilordnetRessurs || 'Ikke tildelt'}</td>
                <td>
                    {kanStarteBlankettBehandling && (
                        <Flatknapp onClick={startBlankettBehandling} disabled={laster}>
                            Lag blankett
                        </Flatknapp>
                    )}

                    {kanJournalføres(oppgave) && (
                        <Flatknapp onClick={gåTilJournalføring} disabled={laster}>
                            Gå til journalpost
                        </Flatknapp>
                    )}
                    {måBehandlesIEFSak(oppgave) && (
                        <Flatknapp onClick={gåTilBehandleSakOppgave} disabled={laster}>
                            Start Behandling
                        </Flatknapp>
                    )}
                    {måHåndteresIGosys && (
                        <Normaltekst style={{ marginLeft: '2.5rem' }}>
                            Må håndteres i Gosys
                        </Normaltekst>
                    )}
                </td>
            </tr>
            <UIModalWrapper
                modal={{
                    tittel: 'Ugyldig oppgave',
                    lukkKnapp: true,
                    visModal: !!feilmelding,
                    onClose: () => settFeilmelding(''),
                }}
            >
                <Normaltekst>{feilmelding}</Normaltekst>
            </UIModalWrapper>
        </>
    );
};

export default OppgaveRad;
