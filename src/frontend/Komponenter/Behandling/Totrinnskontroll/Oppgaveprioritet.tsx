import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React from 'react';

interface Props {
    erHøyPrioritet: boolean;
    settErHøyPrioritet: (ervalgt: boolean) => void;
}

export const Oppgaveprioritet = ({ erHøyPrioritet, settErHøyPrioritet }: Props) => {
    return (
        <CheckboxGroup legend="Godkjenne vedtak-oppgavens prioritet:">
            <Checkbox value={erHøyPrioritet} onChange={() => settErHøyPrioritet(!erHøyPrioritet)}>
                Høy
            </Checkbox>
        </CheckboxGroup>
    );
};
