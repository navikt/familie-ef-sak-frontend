import React from 'react';
import { formaterFødselsnummer } from '../../utils/formatter';
import Clipboard from '@navikt/familie-clipboard';

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string | undefined }> = ({
    fødselsnummer,
}) => {
    return fødselsnummer ? (
        <Clipboard>
            <span>{formaterFødselsnummer(fødselsnummer)}</span>
        </Clipboard>
    ) : null;
};
