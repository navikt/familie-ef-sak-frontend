import { TextField } from '@navikt/ds-react';
import styled from 'styled-components';

export const Søkefelt = styled(TextField)`
    width: 50%;
    padding-right: 1rem;
`;

export const Søkeresultat = styled.div`
    margin-top: 2rem;
    margin-bottom: 10rem;
    display: grid;
    grid-template-columns: 5fr 2fr;
    padding: 10px;
    margin-bottom: 4px;
    background: rgba(196, 196, 196, 0.2);
`;
