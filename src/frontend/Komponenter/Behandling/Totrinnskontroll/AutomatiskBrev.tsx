import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';

export enum AutomatiskBrevValg {
    VARSEL_OM_AKTIVITETSPLIKT = 'VARSEL_OM_AKTIVITETSPLIKT',
}

const automatiskBrevValgTekst: Record<AutomatiskBrevValg, string> = {
    [AutomatiskBrevValg.VARSEL_OM_AKTIVITETSPLIKT]: 'Varsel om aktivitetsplikt',
};

const automatiskBrevAlternativer: AutomatiskBrevValg[] = Object.values(AutomatiskBrevValg);

export const AutomatiskBrev: FC<{
    automatiskBrev: AutomatiskBrevValg[];
    settAutomatiskBrev: React.Dispatch<React.SetStateAction<AutomatiskBrevValg[]>>;
}> = ({ automatiskBrev, settAutomatiskBrev }) => {
    return (
        <CheckboxGroup
            legend="Send brev automatisk når vedtaket er godkjent:"
            onChange={(val) => settAutomatiskBrev(val as AutomatiskBrevValg[])}
            value={automatiskBrev}
        >
            {automatiskBrevAlternativer.map((valg) => (
                <Checkbox key={valg} value={valg}>
                    {automatiskBrevValgTekst[valg]}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};
