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
    padding: 0 0.5rem 2rem 0.5rem;
    margin: 0;
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
                            const første = idx === 0;
                            const siste = idx === behandlingHistorikkResponse.length - 1;

                            return (
                                <HistorikkElement
                                    første={første}
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
