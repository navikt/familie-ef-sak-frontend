import { Box, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React, { FC } from 'react';
import { AutomatiskBrevValg, automatiskBrevValgTekst } from '../Totrinnskontroll/AutomatiskBrev';

export const AutomatiskBrevSomSendes: FC<{
    automatiskBrev?: AutomatiskBrevValg[];
}> = ({ automatiskBrev }) => {
    if (!automatiskBrev || automatiskBrev.length === 0) {
        return null;
    }

    return (
        <Box background="meta-lime-soft" padding="space-8">
            <CheckboxGroup
                legend="Send brev automatisk når vedtaket er godkjent:"
                value={automatiskBrev}
                readOnly
            >
                {automatiskBrev &&
                    automatiskBrev.map((brev, idx) => (
                        <Checkbox key={idx} value={brev}>
                            {automatiskBrevValgTekst[brev]}
                        </Checkbox>
                    ))}
            </CheckboxGroup>
        </Box>
    );
};
