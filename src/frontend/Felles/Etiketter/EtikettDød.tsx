import React from 'react';
import styled from 'styled-components';
import { formaterIsoDato } from '../../App/utils/formatter';
import { Tag } from '@navikt/ds-react';

const SortTag = styled(Tag)`
    background-color: black;
    color: #eee;
    margin-left: 0.5rem;
    border: none;
`;

const EtikettDød: React.FC<{ dødsdato: string }> = ({ dødsdato }) => (
    <SortTag variant={'warning'} size={'small'}>
        Død {formaterIsoDato(dødsdato)}
    </SortTag>
);

export default EtikettDød;
