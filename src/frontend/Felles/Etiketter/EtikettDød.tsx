import React from 'react';
import { formaterIsoDato } from '../../App/utils/formatter';
import { Tag } from '@navikt/ds-react';

const EtikettDød: React.FC<{ dødsdato: string }> = ({ dødsdato }) => (
    <div>
        <Tag variant="neutral-filled" size="xsmall">
            Død {formaterIsoDato(dødsdato)}
        </Tag>
    </div>
);

export default EtikettDød;
