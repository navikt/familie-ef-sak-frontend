import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { formaterTallMedTusenSkille } from '../../../../../App/utils/formatter';

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
            <BodyShortBold>{formaterTallMedTusenSkille(makssats)} kr</BodyShortBold>
        </FlexColumn>
    );
};

export default Makssats;
