import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React from 'react';

interface Props {
    prioritetHøy: boolean;
    settPrioritetHøy: (ervalgt: boolean) => void;
}

export const Oppgaveprioritet = ({ prioritetHøy, settPrioritetHøy }: Props) => {
    return (
        <CheckboxGroup legend="Godkjenne vedtak-oppgavens prioritet:">
            <Checkbox value={prioritetHøy} onChange={() => settPrioritetHøy(!prioritetHøy)}>
                Høy
            </Checkbox>
        </CheckboxGroup>
    );
};
