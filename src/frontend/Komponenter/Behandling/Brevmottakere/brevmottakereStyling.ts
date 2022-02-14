import styled from 'styled-components';
import { Input } from 'nav-frontend-skjema';

export const StyledSøkInput = styled(Input)`
    width: 50%;
    padding-right: 1rem;
`;

export const StyledSøkResultat = styled.div`
    margin-top: 2rem;
    margin-bottom: 10rem;
    display: grid;
    grid-template-columns: 5fr 1fr;
    padding: 10px;
    margin-bottom: 4px;
    background: rgba(196, 196, 196, 0.2);
`;
