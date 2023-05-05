import * as React from 'react';
import { Checkbox } from '@navikt/ds-react';
import { Behandling } from '../../../App/typer/fagsak';
import { IOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { FamilieCheckboxGroup } from '@navikt/familie-form-elements';
import styled from 'styled-components';
import { AGray800 } from '@navikt/ds-tokens/dist/tokens';
import {
    oppgaveForOpprettelseTilTekst,
    OppgaveTypeForOpprettelse,
} from './oppgaveForOpprettelseTyper';

export const HvitTekst = styled.div`
    color: white;
`;

const CheckboxGruppe = styled(FamilieCheckboxGroup)`
    width: 30rem;
    margin: 0.5rem 1rem;
    padding: 0 1rem;
    background-color: ${AGray800};
    border-radius: 5px;
`;
const OppgaverForOpprettelse: React.FC<{
    behandling: Behandling;
    oppgaverForOpprettelse: IOppgaverForOpprettelse;
}> = ({ oppgaverForOpprettelse }) => {
    const {
        feilmelding,
        oppgavetyperSomKanOpprettes,
        oppgavetyperSomSkalOpprettes,
        settOppgavetyperSomSkalOpprettes,
    } = oppgaverForOpprettelse;

    if (feilmelding) {
        return <AlertError>{feilmelding}</AlertError>;
    }

    if (oppgavetyperSomKanOpprettes.length === 0) {
        return null;
    }

    return (
        <CheckboxGruppe
            legend={''}
            erLesevisning={false}
            value={oppgavetyperSomSkalOpprettes}
            onChange={(oppgavetyper: string[]) =>
                settOppgavetyperSomSkalOpprettes(oppgavetyper as OppgaveTypeForOpprettelse[])
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
