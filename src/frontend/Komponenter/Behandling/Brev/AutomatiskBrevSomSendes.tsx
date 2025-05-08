import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';
import React, { FC } from 'react';
import styled from 'styled-components';
import { AutomatiskBrevValg, automatiskBrevValgTekst } from '../Totrinnskontroll/AutomatiskBrev';

const Container = styled.div`
    background: ${ALimegreen100};
    padding: 0.5rem;
`;

export const AutomatiskBrevSomSendes: FC<{
    automatiskBrev?: AutomatiskBrevValg[];
}> = ({ automatiskBrev }) => {
    if (!automatiskBrev || automatiskBrev.length === 0) {
        return null;
    }

    return (
        <Container>
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
        </Container>
    );
};
