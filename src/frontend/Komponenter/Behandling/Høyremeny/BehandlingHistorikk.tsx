import * as React from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { useBehandling } from '../../../App/context/BehandlingContext';
import HistorikkElement from './HistorikkElement';
import { behandlingHarBlittUnderkjentDeretterGodkjent } from './utils';

interface IBehandlingHistorikkProps {
    behandlingId: string;
}

const HistorikkListe = styled.ul`
    padding: 0 0.5rem 2rem 0.5rem;
    margin: 0;
`;

const BehandlingHistorikk: React.FC<IBehandlingHistorikkProps> = ({ behandlingId }) => {
    const { behandlingHistorikk, behandling } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikkResponse: behandlingHistorikk, behandling }}>
            {({ behandlingHistorikkResponse, behandling }) => {
                const skalViseBegrunnelse = !behandlingHarBlittUnderkjentDeretterGodkjent(
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

export default hiddenIf(BehandlingHistorikk);
