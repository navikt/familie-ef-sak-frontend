import React from 'react';
import { formaterIsoDato } from '../../App/utils/formatter';
import { Tag } from '@navikt/ds-react';

const EtikettDød: React.FC<{ dødsdato: string; skalViseDato?: boolean }> = ({
    dødsdato,
    skalViseDato = true,
}) => (
    <div>
        <Tag variant="neutral-filled" size="xsmall">
            {skalViseDato ? `Død ${formaterIsoDato(dødsdato)}` : 'Død'}
        </Tag>
    </div>
);

export default EtikettDød;
