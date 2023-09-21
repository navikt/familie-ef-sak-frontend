import React from 'react';
import { formaterFødselsnummer } from '../../App/utils/formatter';
import { CopyButton } from '@navikt/ds-react';
import styled from 'styled-components';

const NoWrapSpan = styled.span`
    white-space: nowrap;
    font-size: 16px;
    display: flex;
    align-items: center;
`;

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string }> = ({
    fødselsnummer,
}) => {
    return (
        <NoWrapSpan>
            <span>{formaterFødselsnummer(fødselsnummer)}</span>
            <CopyButton
                size={'xsmall'}
                copyText={formaterFødselsnummer(fødselsnummer)}
                variant={'action'}
                activeText={'kopiert'}
            />
        </NoWrapSpan>
    );
};
