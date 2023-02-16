import React, { useEffect } from 'react';
import { IOppgave } from './typer/oppgave';
import { useOppgave } from '../../App/hooks/useOppgave';
import { useApp } from '../../App/context/AppContext';
import { Button } from '@navikt/ds-react';
import { EllipsisCircleH } from '@navikt/ds-icons';
import styled from 'styled-components';
import {
    oppgaveKanJournalføres,
    oppgaveErSaksbehandling,
    oppgaveErJournalførKlage,
    utledetFolkeregisterIdent,
} from './utils';
import { Dropdown } from '@navikt/ds-react-internal';

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
        plukkOppgaveOgGåTilBehandlingsoversikt,
        tilbakestillFordeling,
        settOppgaveTilSaksbehandler,
        feilmelding,
    } = useOppgave(oppgave);

    const { innloggetSaksbehandler } = useApp();

    useEffect(() => {
        settFeilmelding(feilmelding);
    }, [feilmelding, settFeilmelding]);

    const gåTilOppgaveUtførelse = () => {
        if (oppgaveErSaksbehandling(oppgave)) {
            gåTilBehandleSakOppgave();
        } else if (oppgaveErJournalførKlage(oppgave)) {
            gåTilJournalføring('klage');
        } else if (oppgaveKanJournalføres(oppgave)) {
            gåTilJournalføring('stønad');
        } else {
            plukkOppgaveOgGåTilBehandlingsoversikt(utledetFolkeregisterIdent(oppgave));
        }
    };

    const utførHandlingOgHentOppgavePåNytt = (handling: () => Promise<void>) => async () => {
        await handling();
        hentOppgavePåNytt();
    };

    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === innloggetSaksbehandler.navIdent;

    const skalViseFortsettKnapp =
        oppgaveTilordnetInnloggetSaksbehandler &&
        (oppgaveErSaksbehandling(oppgave) ||
            oppgaveErJournalførKlage(oppgave) ||
            oppgaveKanJournalføres(oppgave));

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
                onClick={gåTilOppgaveUtførelse}
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
                icon={<EllipsisCircleH />}
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
