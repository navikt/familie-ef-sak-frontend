import React from 'react';
import { formaterFødselsnummer } from '../../App/utils/formatter';
import Clipboard from '@navikt/familie-clipboard';
import styled from 'styled-components';

const NoWrapSpan = styled.span`
    white-space: nowrap;
`;

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string }> = ({
    fødselsnummer,
}) => {
    return (
        <NoWrapSpan>
            <Clipboard>
                <span>{formaterFødselsnummer(fødselsnummer)}</span>
            </Clipboard>
        </NoWrapSpan>
    );
};
