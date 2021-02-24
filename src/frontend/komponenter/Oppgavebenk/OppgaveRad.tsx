import React from 'react';
import { IOppgave } from './oppgave';
import { Oppgavetype, oppgaveTypeTilTekst, prioritetTilTekst } from './oppgavetema';
import { enhetsmappeTilTekst } from './enhetsmappe';
import { Behandlingstema, behandlingstemaTilTekst } from '../../typer/behandlingstema';
import { formaterIsoDato } from '../../utils/formatter';
import { Flatknapp as Knapp } from 'nav-frontend-knapper';
import UIModalWrapper from '../Felleskomponenter/Modal/UIModalWrapper';
import { Normaltekst } from 'nav-frontend-typografi';
import hiddenIf from '../Felleskomponenter/HiddenIf/hiddenIf';
import { useOppgave } from '../../hooks/useOppgave';

interface Props {
    oppgave: IOppgave;
}

const Flatknapp = hiddenIf(Knapp);

const kanJournalføres = (behandlingstema?: Behandlingstema, oppgavetype?: Oppgavetype) => {
    return (
        oppgavetype === 'JFR' &&
        behandlingstema &&
        ['ab0071', 'ab0177', 'ab0028'].includes(behandlingstema)
    );
};

const kanBehandles = (behandlingstema?: Behandlingstema, oppgavetype?: Oppgavetype) => {
    return (
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
    } = useOppgave(oppgave);
    const regDato = oppgave.opprettetTidspunkt && formaterIsoDato(oppgave.opprettetTidspunkt);

    const oppgavetype = oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype];

    const fristFerdigstillelseDato =
        oppgave.fristFerdigstillelse && formaterIsoDato(oppgave.fristFerdigstillelse);

    const prioritet = oppgave.prioritet && prioritetTilTekst[oppgave.prioritet];
    const enhetsmappe = oppgave.mappeId && enhetsmappeTilTekst[oppgave.mappeId];

    const behandlingstema =
        oppgave.behandlingstema &&
        behandlingstemaTilTekst[oppgave.behandlingstema as Behandlingstema];

    return (
        <>
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
                    <Flatknapp
                        hidden={!kanJournalføres(oppgave.behandlingstema, oppgave.oppgavetype)}
                        onClick={gåTilJournalføring}
                    >
                        Gå til journalpost
                    </Flatknapp>
                    <Flatknapp
                        hidden={!kanBehandles(oppgave.behandlingstema, oppgave.oppgavetype)}
                        onClick={gåTilBehandleSakOppgave}
                    >
                        Behandle sak
                    </Flatknapp>
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
                <Flatknapp onClick={startBlankettBehandling}>Opprett blankettbehandling</Flatknapp>
            </UIModalWrapper>
        </>
    );
};

export default OppgaveRad;
