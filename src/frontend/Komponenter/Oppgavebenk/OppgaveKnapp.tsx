import React from 'react';
import { IOppgave } from './typer/oppgave';
import { useOppgave } from '../../App/hooks/useOppgave';
import { useApp } from '../../App/context/AppContext';
import { Handling } from './typer/handling';
import { Button } from '@navikt/ds-react';
import { EllipsisCircleH } from '@navikt/ds-icons';
import styled from 'styled-components';
import { utledetFolkeregisterIdent, utledHandling } from './utils';
import { Dropdown } from '@navikt/ds-react-internal';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const OppgaveKnapp: React.FC<{ oppgave: IOppgave; oppdaterOppgave: () => void }> = ({
    oppgave,
    oppdaterOppgave,
}) => {
    const {
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        laster,
        plukkOppgaveOgGåTilBehandlingsoversikt,
        tilbakestillFordeling,
        settOppgaveTilSaksbehandler,
    } = useOppgave(oppgave);

    const { innloggetSaksbehandler } = useApp();

    const utførHandling = () => {
        switch (utledHandling(oppgave)) {
            case Handling.JOURNALFØR:
                gåTilJournalføring('stønad');
                break;
            case Handling.JOURNALFØR_KLAGE:
                gåTilJournalføring('klage');
                break;
            case Handling.SAKSBEHANDLE:
                gåTilBehandleSakOppgave();
                break;
            default:
                plukkOppgaveOgGåTilBehandlingsoversikt(utledetFolkeregisterIdent(oppgave));
        }
    };

    const utførHandlingOgOppdaterOppgave = (handling: () => Promise<void>) => async () => {
        await handling();
        oppdaterOppgave();
    };

    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === innloggetSaksbehandler.navIdent;

    const skalViseFortsettKnapp =
        oppgaveTilordnetInnloggetSaksbehandler &&
        [Handling.SAKSBEHANDLE, Handling.JOURNALFØR, Handling.JOURNALFØR_KLAGE].includes(
            utledHandling(oppgave)
        );

    if (oppgaveTilordnetInnloggetSaksbehandler) {
        return (
            <FlexContainer>
                {skalViseFortsettKnapp ? (
                    <TabellKnapp
                        type={'button'}
                        variant={'secondary'}
                        size={'small'}
                        onClick={utførHandling}
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
                            onClick: utførHandlingOgOppdaterOppgave(tilbakestillFordeling),
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
                            onClick: utførHandlingOgOppdaterOppgave(settOppgaveTilSaksbehandler),
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
                onClick={utførHandling}
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
                    {valg.map((valg) => (
                        <Dropdown.Menu.List.Item onClick={valg.onClick}>
                            {valg.label}
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
