import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    oppgaveSomSkalOpprettesTilTekst,
    OppgaveTypeForOpprettelse,
} from '../Totrinnskontroll/oppgaveForOpprettelseTyper';
import { styled } from 'styled-components';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    background: ${ALimegreen100};
    padding: 0.5rem;
`;

export const FremleggoppgaverSomOpprettes: FC<{
    oppgavetyperSomSkalOpprettes?: OppgaveTypeForOpprettelse[];
}> = ({ oppgavetyperSomSkalOpprettes }) => {
    if (!oppgavetyperSomSkalOpprettes || oppgavetyperSomSkalOpprettes.length === 0) {
        return;
    }

    return (
        <Container>
            <CheckboxGroup
                legend="Følgende fremleggsoppgaver opprettes ved godkjenning av dette vedtaket:"
                value={oppgavetyperSomSkalOpprettes}
                readOnly
            >
                {oppgavetyperSomSkalOpprettes.map((oppgaveType, idx) => (
                    <Checkbox key={idx} value={oppgaveType}>
                        {oppgaveSomSkalOpprettesTilTekst[oppgaveType]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </Container>
    );
};
