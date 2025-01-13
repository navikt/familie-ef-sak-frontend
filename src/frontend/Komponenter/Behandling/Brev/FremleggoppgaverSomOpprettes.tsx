import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    oppgaveSomSkalOpprettesTilTekst,
    OppgaveTypeForOpprettelse,
} from '../Totrinnskontroll/oppgaveForOpprettelseTyper';
import { styled } from 'styled-components';

const Container = styled.div`
    background: #f9fccc;
    padding: 0.5rem;
    margin-top: 2rem;
`;

export const FremleggoppgaverSomOpprettes: FC<{
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}> = ({ oppgavetyperSomSkalOpprettes }) => {
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
