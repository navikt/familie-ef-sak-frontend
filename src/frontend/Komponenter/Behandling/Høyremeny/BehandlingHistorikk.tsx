import * as React from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { useBehandling } from '../../../App/context/BehandlingContext';
import HistorikkElement from './HistorikkElement';

const HistorikkListe = styled.ul`
    padding: 0 0.5rem 2rem 0.5rem;
    margin: 0;
`;

const BehandlingHistorikk: React.FC = () => {
    const { behandlingHistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikkResponse: behandlingHistorikk }}>
            {({ behandlingHistorikkResponse }) => {
                return (
                    <HistorikkListe>
                        {behandlingHistorikkResponse.map((behandlingshistorikk, idx) => {
                            const første = idx === 0;
                            const siste = idx === behandlingHistorikkResponse.length - 1;

                            console.log('HISTORIKK', behandlingshistorikk);

                            return (
                                <HistorikkElement
                                    første={første}
                                    siste={siste}
                                    behandlingshistorikk={behandlingshistorikk}
                                    key={idx}
                                />
                            );
                        })}
                    </HistorikkListe>
                );
            }}
        </DataViewer>
    );
};

export default hiddenIf(BehandlingHistorikk);
