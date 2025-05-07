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
    return (
        <Container>
            <CheckboxGroup
                legend="Følgende brev sendes automatisk ved godkjenning av dette vedtaket:"
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
