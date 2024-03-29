import React, { useEffect } from 'react';
import { IOppgave } from './typer/oppgave';
import { useOppgave } from '../../App/hooks/useOppgave';
import { useApp } from '../../App/context/AppContext';
import { Button } from '@navikt/ds-react';
import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import {
    oppgaveKanJournalføres,
    oppgaveErSaksbehandling,
    oppgaveErJournalførKlage,
    utledetFolkeregisterIdent,
    oppgaveErTilbakekreving,
    oppgaveErKlage,
} from './utils';
import { Dropdown } from '@navikt/ds-react';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
`;

export const OppgaveKnapp: React.FC<{
    oppgave: IOppgave;
    hentOppgavePåNytt: () => void;
    settFeilmelding: (feilmelding: string) => void;
}> = ({ oppgave, hentOppgavePåNytt, settFeilmelding }) => {
    const {
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        laster,
        hentFagsakOgTriggRedirectTilBehandlingsoversikt,
        tilbakestillFordeling,
        settOppgaveTilSaksbehandler,
        feilmelding,
    } = useOppgave(oppgave);

    const { innloggetSaksbehandler } = useApp();

    useEffect(() => {
        settFeilmelding(feilmelding);
    }, [feilmelding, settFeilmelding]);

    const tildelOgGåTilOppgaveutførelse = () =>
        settOppgaveTilSaksbehandler()
            .then(gåTilOppgaveUtførelse)
            .catch((e) => settFeilmelding(e.message));

    const gåTilOppgaveUtførelse = () => {
        if (oppgaveErSaksbehandling(oppgave)) {
            gåTilBehandleSakOppgave();
        } else if (oppgaveErJournalførKlage(oppgave)) {
            gåTilJournalføring('klage');
        } else if (oppgaveKanJournalføres(oppgave)) {
            gåTilJournalføring('stønad');
        } else {
            hentFagsakOgTriggRedirectTilBehandlingsoversikt(utledetFolkeregisterIdent(oppgave));
        }
    };

    const utførHandlingOgHentOppgavePåNytt = (handling: () => Promise<void>) => () => {
        handling()
            .then(() => hentOppgavePåNytt())
            .catch((error: Error) => settFeilmelding(error.message));
    };

    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === innloggetSaksbehandler.navIdent;

    const skalViseFortsettKnapp =
        oppgaveTilordnetInnloggetSaksbehandler &&
        (oppgaveErSaksbehandling(oppgave) ||
            oppgaveErJournalførKlage(oppgave) ||
            oppgaveKanJournalføres(oppgave) ||
            oppgaveErKlage(oppgave) ||
            oppgaveErTilbakekreving(oppgave));

    if (oppgaveTilordnetInnloggetSaksbehandler) {
        return (
            <FlexContainer>
                {skalViseFortsettKnapp ? (
                    <TabellKnapp
                        type={'button'}
                        variant={'secondary'}
                        size={'small'}
                        onClick={gåTilOppgaveUtførelse}
                        disabled={laster}
                    >
                        Fortsett
                    </TabellKnapp>
                ) : (
                    oppgave.tilordnetRessurs
                )}
                <OppgaveValgMeny
                    valg={[
                        {
                            label: 'Fjern meg',
                            onClick: utførHandlingOgHentOppgavePåNytt(tilbakestillFordeling),
                        },
                    ]}
                />
            </FlexContainer>
        );
    } else if (oppgave.tilordnetRessurs) {
        return (
            <FlexContainer>
                {oppgave.tilordnetRessurs}
                <OppgaveValgMeny
                    valg={[
                        {
                            label: 'Overta',
                            onClick: utførHandlingOgHentOppgavePåNytt(settOppgaveTilSaksbehandler),
                        },
                    ]}
                />
            </FlexContainer>
        );
    } else
        return (
            <TabellKnapp
                type={'button'}
                variant={'secondary'}
                size={'small'}
                onClick={tildelOgGåTilOppgaveutførelse}
                disabled={laster}
            >
                Tildel meg
            </TabellKnapp>
        );
};

type OppgaveValg = { label: string; onClick: () => void };

const OppgaveValgMeny: React.FC<{ valg: OppgaveValg[] }> = ({ valg }) => {
    return (
        <Dropdown>
            <Button
                variant={'tertiary'}
                icon={<MenuElipsisHorizontalCircleIcon />}
                size={'small'}
                as={Dropdown.Toggle}
            />
            <Dropdown.Menu>
                <Dropdown.Menu.List>
                    {valg.map((valg, indeks) => (
                        <Dropdown.Menu.List.Item key={indeks} onClick={valg.onClick}>
                            {valg.label}
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
