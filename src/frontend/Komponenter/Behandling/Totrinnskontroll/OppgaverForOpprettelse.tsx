import * as React from 'react';
import { useEffect } from 'react';
import { Checkbox } from '@navikt/ds-react';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Behandling } from '../../../App/typer/fagsak';
import { OppgaverForOpprettelseState } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { FamilieCheckboxGroup } from '@navikt/familie-form-elements';
import styled from 'styled-components';
import { AGrayalpha300 } from '@navikt/ds-tokens/dist/tokens';
export const HvitTekst = styled.div`
    color: white;
`;

const CheckboxGruppe = styled(FamilieCheckboxGroup)`
    width: 30rem;
    margin: 0.5rem 1rem 0.5rem 1rem;
    padding: 0 0.25rem 0 0.25rem;
    background-color: ${AGrayalpha300};
    border-radius: 5px;
`;

export enum OppgaveForOpprettelseType {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID = 'INNTEKTSKONTROLL_1_ÅR_FREM_I_TID',
}

export interface IOppgaverForOpprettelse {
    oppgavetyperSomKanOpprettes: OppgaveForOpprettelseType[];
    oppgavetyperSomSkalOpprettes: OppgaveForOpprettelseType[];
}

export const oppgaveForOpprettelseTilTekst: Record<OppgaveForOpprettelseType, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID:
        'Når vedtaket er godkjent skal det automatisk opprettes en oppgave for kontroll av inntekt 1 år frem i tid',
};
export const oppgaveSomSkalOpprettesTilTekst: Record<OppgaveForOpprettelseType, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID:
        'Det vil automatisk opprettes en oppgave for kontroll av inntekt 1 år frem i tid når vedtaket godkjennes',
};
const OppgaverForOpprettelse: React.FC<{
    behandling: Behandling;
    oppgaverForOpprettelseState: OppgaverForOpprettelseState;
}> = ({ behandling, oppgaverForOpprettelseState }) => {
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

    if (oppgavetyperSomKanOpprettes.length === 0) {
        return null;
    }

    // FamilieCheckboxGroup bruker verdiene direkt hvis det er lesevisning
    const checkboxverdier = oppgavetyperSomSkalOpprettes;

    return (
        <CheckboxGruppe
            legend={''}
            erLesevisning={false}
            value={checkboxverdier}
            onChange={(oppgavetyper: string[]) =>
                oppdaterOppgavetyperSomSkalOpprettes(oppgavetyper as OppgaveForOpprettelseType[])
            }
        >
            {oppgavetyperSomKanOpprettes.map((oppgavetype) => {
                return (
                    <Checkbox key={oppgavetype} value={oppgavetype}>
                        <HvitTekst>{oppgaveForOpprettelseTilTekst[oppgavetype]}</HvitTekst>
                    </Checkbox>
                );
            })}
        </CheckboxGruppe>
    );
};

export default OppgaverForOpprettelse;
