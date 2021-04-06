import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableFødsesnummer } from '../../utils/formatter';
import Clipboard from '@navikt/familie-clipboard';

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string | undefined }> = ({
    fødselsnummer,
}) => {
    return fødselsnummer ? (
        <Clipboard>
            <Normaltekst>{formaterNullableFødsesnummer(fødselsnummer)}</Normaltekst>
        </Clipboard>
    ) : null;
};
