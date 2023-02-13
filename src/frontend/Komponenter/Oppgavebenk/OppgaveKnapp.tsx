import React, { useEffect, useRef, useState } from 'react';
import { IOppgave } from './typer/oppgave';
import { useOppgave } from '../../App/hooks/useOppgave';
import { useApp } from '../../App/context/AppContext';
import { Handling } from './typer/handling';
import { Button } from '@navikt/ds-react';
import { EllipsisCircleH } from '@navikt/ds-icons';
import styled from 'styled-components';
import {
    måBehandlesIEFSak,
    oppgaveErJournalførKlage,
    oppgaveErKlage,
    oppgaveErTilbakekreving,
    oppgaveErVurderKonsekvensForYtelse,
    utledetFolkeregisterIdent,
} from './utils';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const kanJournalføres = (oppgave: IOppgave) => {
    const { oppgavetype } = oppgave;

    return oppgavetype === 'JFR';
};

export const OppgaveKnapp: React.FC<{ oppgave: IOppgave }> = ({ oppgave }) => {
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

    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === innloggetSaksbehandler.navIdent;

    if (oppgaveTilordnetInnloggetSaksbehandler) {
        return (
            <FlexContainer>
                <TabellKnapp
                    type={'button'}
                    variant={'secondary'}
                    size={'small'}
                    onClick={utførHandling}
                    disabled={laster}
                >
                    Fortsett
                </TabellKnapp>
                <OppgaveValgMeny valg={[{ label: 'Fjern meg', onClick: tilbakestillFordeling }]} />
            </FlexContainer>
        );
    } else if (!oppgave.tilordnetRessurs) {
        return (
            <FlexContainer>
                <TabellKnapp
                    type={'button'}
                    variant={'secondary'}
                    size={'small'}
                    onClick={utførHandling}
                    disabled={laster}
                >
                    Tildel meg
                </TabellKnapp>
            </FlexContainer>
        );
    } else
        return (
            <FlexContainer>
                {oppgave.tilordnetRessurs}
                <OppgaveValgMeny
                    valg={[
                        { label: 'Overta', onClick: settOppgaveTilSaksbehandler },
                        { label: 'Sett på vent', onClick: settOppgaveTilSaksbehandler },
                    ]}
                />
            </FlexContainer>
        );
};

type oppgaveValg = { label: string; onClick: () => void };

const OppgaveValgMeny: React.FC<{ valg: oppgaveValg[] }> = ({ valg }) => {
    const [visValg, settVisValg] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        const håndterKlikkUtenforKomponent = (event: { target: never }) => {
            // @ts-ignore
            if (visValg && ref.current && !ref.current.contains(event.target)) {
                settVisValg(false);
            }
        };

        // @ts-ignore
        document.addEventListener('click', håndterKlikkUtenforKomponent, true);

        return () => {
            // @ts-ignore
            document.removeEventListener('click', håndterKlikkUtenforKomponent, true);
        };
    }, [visValg]);

    return (
        <>
            <Button
                variant={'tertiary'}
                icon={<EllipsisCircleH />}
                size={'small'}
                onClick={() => {
                    settVisValg(!visValg);
                }}
            />
            <Oppgavevalg åpen={visValg} ref={ref}>
                {valg.map((valg) => (
                    <Button variant={'tertiary'} size={'small'} onClick={valg.onClick}>
                        {valg.label}
                    </Button>
                ))}
            </Oppgavevalg>
        </>
    );
};

const Oppgavevalg = styled.div`
    display: ${(props: { åpen: boolean }) => (props.åpen ? 'flex' : 'none')};

    flex-direction: column;
    position: absolute;

    background-color: white;

    right: 3rem;

    border: 1px solid grey;
    border-radius: 4px;

    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);

    white-space: nowrap;

    .navds-button {
        width: 100%;
        height: 100%;
    }
`;
