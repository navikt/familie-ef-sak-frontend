import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';
import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background: ${ALimegreen100};
    padding: 0.5rem;
`;

export const AutomatiskBrevSomSendes: FC<{
    automatiskBrev: string[] | undefined;
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
                            {brev}
                        </Checkbox>
                    ))}
            </CheckboxGroup>
        </Container>
    );
};
