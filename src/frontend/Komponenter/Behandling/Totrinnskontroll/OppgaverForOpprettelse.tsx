import * as React from 'react';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import { AGray800 } from '@navikt/ds-tokens/dist/tokens';
import {
    oppgaveForOpprettelseTilTekst,
    OppgaveTypeForOpprettelse,
} from './oppgaveForOpprettelseTyper';

export const HvitTekst = styled.div`
    color: white;
`;

const CheckboxGruppe = styled(CheckboxGroup)`
    width: 30rem;
    margin: 0.5rem 1rem;
    padding: 0 1rem;
    background-color: ${AGray800};
    border-radius: 5px;
`;

const OppgaverForOpprettelse: React.FC<{
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[];
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    settOppgavetyperSomSkalOpprettes: React.Dispatch<
        React.SetStateAction<OppgaveTypeForOpprettelse[]>
    >;
}> = ({
    oppgavetyperSomKanOpprettes,
    oppgavetyperSomSkalOpprettes,
    settOppgavetyperSomSkalOpprettes,
}) => {
    if (!oppgavetyperSomKanOpprettes || oppgavetyperSomKanOpprettes.length === 0) {
        return;
    }

    return (
        <CheckboxGruppe
            legend={''}
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
