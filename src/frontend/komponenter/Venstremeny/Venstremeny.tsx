import * as React from 'react';
import EndringerRegistergrunnlag from './EndringerRegistergrunnlag';
import { Behandling } from '../../typer/fagsak';
import styled from 'styled-components';
import { Undertittel } from 'nav-frontend-typografi';

const StyledBehandling = styled.div`
    padding: 1rem;
`;

const Venstremeny: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    return (
        <StyledBehandling>
            <Undertittel>Behandling</Undertittel>
            <div>Id: {behandling?.id}</div>
            <div>Opprettet: {behandling?.opprettet}</div>
            <div>Resultat: {behandling?.resultat}</div>
            <div>Sist endret: {behandling?.sistEndret}</div>
            <div>Behandlingstatus: {behandling?.status}</div>
            <div>Steg: {behandling?.steg}</div>
            <div>Type: {behandling?.type}</div>
            <EndringerRegistergrunnlag />
        </StyledBehandling>
    );
};

export default Venstremeny;
