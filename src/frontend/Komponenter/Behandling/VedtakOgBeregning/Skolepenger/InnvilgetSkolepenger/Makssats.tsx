import React from 'react';
import { BodyShort, Heading, HelpText } from '@navikt/ds-react';
import styled from 'styled-components';

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FlexRow = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const BodyShortBold = styled(BodyShort)`
    font-weight: bold;
    text-decoration: underline;
`;

type Props = {
    makssats: number;
};

const Makssats: React.FC<Props> = ({ makssats }) => {
    return (
        <FlexColumn>
            <Heading size={'small'} level={'3'}>
                Makssats for oppgitt periode
            </Heading>
            <FlexRow>
                <BodyShortBold>{makssats}</BodyShortBold>
                <HelpText>Lorem ipsum dollor sit amet concecteur.</HelpText>
            </FlexRow>
        </FlexColumn>
    );
};

export default Makssats;
