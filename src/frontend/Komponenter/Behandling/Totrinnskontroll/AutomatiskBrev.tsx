import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';
export type AutomatiskBrevValg = 'Varsel om aktivitetsplikt' | 'TEST';

const automatiskBrevAlternativer: AutomatiskBrevValg[] = [
    'Varsel om aktivitetsplikt',
    'TEST',
] as const;

export const AutomatiskBrev: FC<{
    automatiskBrev: AutomatiskBrevValg[];
    settAutomatiskBrev: React.Dispatch<React.SetStateAction<AutomatiskBrevValg[]>>;
}> = ({ automatiskBrev, settAutomatiskBrev }) => {
    return (
        <CheckboxGroup
            legend="Send brev automatisk når vedtaket er godkjent:"
            onChange={settAutomatiskBrev}
            value={automatiskBrev}
        >
            {automatiskBrevAlternativer.map((valg) => (
                <Checkbox key={valg} value={valg}>
                    {valg}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};
