import React from 'react';
import styled from 'styled-components';
import EtikettBase from 'nav-frontend-etiketter';

const SortEtikett = styled(EtikettBase)`
    background-color: black;
    color: #eee;
    margin-left: 0.5rem;
    border: none;
`;

export const EtikettDød = (): React.ReactElement => (
    <SortEtikett mini type={'info'}>
        Død
    </SortEtikett>
);
