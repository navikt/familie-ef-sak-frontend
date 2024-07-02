import * as React from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { useBehandling } from '../../../App/context/BehandlingContext';
import HistorikkElement from './HistorikkElement';
import { behandlingHarBlittGodkjent } from './utils';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
    behandlingId: string;
}

const HistorikkListe = styled.ul`
    padding: 0;
    margin: 0.5rem 1rem;
`;

const BehandlingHistorikk: React.FC<Props> = ({ behandling, behandlingId }) => {
    const { behandlingHistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikkResponse: behandlingHistorikk }}>
            {({ behandlingHistorikkResponse }) => {
                const skalViseBegrunnelse = !behandlingHarBlittGodkjent(
                    behandlingHistorikkResponse
                );
                return (
                    <HistorikkListe>
                        {behandlingHistorikkResponse.map((behandlingshistorikk, idx) => {
                            const siste = idx === behandlingHistorikkResponse.length - 1;

                            return (
                                <HistorikkElement
                                    siste={siste}
                                    behandlingshistorikk={behandlingshistorikk}
                                    key={idx}
                                    behandlingId={behandlingId}
                                    behandling={behandling}
                                    skalViseBegrunnelse={skalViseBegrunnelse}
                                />
                            );
                        })}
                    </HistorikkListe>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
