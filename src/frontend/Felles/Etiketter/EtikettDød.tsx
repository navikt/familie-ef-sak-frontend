import React from 'react';
import styled from 'styled-components';
import EtikettBase from 'nav-frontend-etiketter';
import { formaterIsoDato } from '../../App/utils/formatter';

const SortEtikett = styled(EtikettBase)`
    background-color: black;
    color: #eee;
    margin-left: 0.5rem;
    border: none;
`;

const EtikettDød: React.FC<{ dødsdato: string }> = ({ dødsdato }) => (
    <SortEtikett mini type={'info'}>
        Død {formaterIsoDato(dødsdato)}
    </SortEtikett>
);

export default EtikettDød;
