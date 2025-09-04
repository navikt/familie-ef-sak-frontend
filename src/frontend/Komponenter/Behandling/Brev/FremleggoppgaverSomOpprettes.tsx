import { CheckboxGroup, Checkbox, Box } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    oppgaveSomSkalOpprettesTilTekst,
    OppgaveTypeForOpprettelse,
} from '../Totrinnskontroll/oppgaveForOpprettelseTyper';

export const FremleggoppgaverSomOpprettes: FC<{
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
}> = ({ oppgavetyperSomSkalOpprettes }) => {
    if (oppgavetyperSomSkalOpprettes.length === 0) {
        return;
    }

    return (
        <Box background={'surface-alt-2-subtle'} padding="space-8">
            <CheckboxGroup
                legend="Følgende oppgave skal opprettes automatisk når vedtaket er godkjent:"
                value={oppgavetyperSomSkalOpprettes}
                readOnly
            >
                {oppgavetyperSomSkalOpprettes.map((oppgaveType, idx) => (
                    <Checkbox key={idx} value={oppgaveType}>
                        {oppgaveSomSkalOpprettesTilTekst[oppgaveType]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </Box>
    );
};
