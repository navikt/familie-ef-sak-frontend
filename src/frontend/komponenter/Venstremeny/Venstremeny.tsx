import * as React from 'react';
import EndringerRegistergrunnlag from './EndringerRegistergrunnlag';
import { Ressurs } from '../../typer/ressurs';
import { Behandling } from '../../typer/fagsak';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';

interface VenstremenyProps {
    behandling: Ressurs<Behandling>;
}

const Venstemeny: React.FC<VenstremenyProps> = ({ behandling }) => {
    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <>
                    <div>Behandling</div>
                    <div>Id: {behandling?.id}</div>
                    <div>Opprettet: {behandling?.opprettet}</div>
                    <div>Resultat: {behandling?.resultat}</div>
                    <div>Sist endret: {behandling?.sistEndret}</div>
                    <div>Behandlingstatus: {behandling?.status}</div>
                    <div>Steg: {behandling?.steg}</div>
                    <div>Type: {behandling?.type}</div>
                    <EndringerRegistergrunnlag />
                </>
            )}
        </DataViewer>
    );
};

export default Venstemeny;
