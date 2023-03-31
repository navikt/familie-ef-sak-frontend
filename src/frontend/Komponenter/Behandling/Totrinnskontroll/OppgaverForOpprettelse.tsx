import * as React from 'react';
import { useEffect } from 'react';
import { BodyShort, Checkbox } from '@navikt/ds-react';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Behandling } from '../../../App/typer/fagsak';
import { HentOppgaverForOpprettelseState } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { AlertError, AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { FamilieCheckboxGroup } from '@navikt/familie-form-elements';

export enum OppgaveForOpprettelseType {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID = 'INNTEKTSKONTROLL_1_ÅR_FREM_I_TID',
}

export interface IOppgaverForOpprettelse {
    oppgavetyperSomKanOpprettes: OppgaveForOpprettelseType[];
    oppgavetyperSomSkalOpprettes: OppgaveForOpprettelseType[];
}

export const oppgaveForOpprettelseTilTekst: Record<OppgaveForOpprettelseType, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID: 'Oppgave for inntektskontroll, 1 år frem i tid',
};

const OppgaverForOpprettelse: React.FC<{
    behandling: Behandling;
    behandlingErRedigerbar: boolean;
    oppgaverForOpprettelseState: HentOppgaverForOpprettelseState;
}> = ({ behandling, behandlingErRedigerbar, oppgaverForOpprettelseState }) => {
    const {
        feilmelding,
        oppgaverForOpprettelse,
        hentOppgaverForOpprettelse,
        oppdaterOppgavetyperSomSkalOpprettes,
    } = oppgaverForOpprettelseState;
    const { oppgavetyperSomKanOpprettes, oppgavetyperSomSkalOpprettes } = oppgaverForOpprettelse;

    useEffect(() => {
        if (behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING) {
            hentOppgaverForOpprettelse(behandling.id);
        }
    }, [behandling, hentOppgaverForOpprettelse]);

    if (feilmelding) {
        return <AlertError>{feilmelding}</AlertError>;
    }

    if (behandlingErRedigerbar && oppgavetyperSomKanOpprettes.length === 0) {
        return null;
    }

    // FamilieCheckboxGroup bruker verdiene direkt hvis det er lesevisning
    const checkboxverdier = behandlingErRedigerbar
        ? oppgavetyperSomSkalOpprettes
        : oppgavetyperSomSkalOpprettes.map(
              (oppgavetype) => oppgaveForOpprettelseTilTekst[oppgavetype]
          );
    return (
        <AlertInfo>
            <FamilieCheckboxGroup
                legend={
                    'Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:'
                }
                erLesevisning={!behandlingErRedigerbar}
                value={checkboxverdier}
                onChange={(oppgavetyper: string[]) =>
                    oppdaterOppgavetyperSomSkalOpprettes(
                        oppgavetyper as OppgaveForOpprettelseType[]
                    )
                }
            >
                {oppgavetyperSomKanOpprettes.map((oppgavetype) => {
                    return (
                        <Checkbox key={oppgavetype} value={oppgavetype}>
                            {oppgaveForOpprettelseTilTekst[oppgavetype]}
                        </Checkbox>
                    );
                })}
            </FamilieCheckboxGroup>
            {!behandlingErRedigerbar && !checkboxverdier.length && (
                <BodyShort>Ingen oppgave opprettes automatisk</BodyShort>
            )}
        </AlertInfo>
    );
};

export default OppgaverForOpprettelse;
