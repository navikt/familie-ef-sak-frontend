import { Systemtittel } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilMedSirkel from '../ikoner/LeggtilMedSirkel';
import styled from 'styled-components';
import { Behandlingstype } from '../typer/behandlingstype';
import { Behandling, Fagsak } from '../typer/fagsak';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { BehandlingRequest } from '../hooks/useJournalføringState';
import { formaterIsoDatoTid } from '../utils/formatter';
import { Ressurs } from '../typer/ressurs';

interface Props {
    settBehandling: (behandling?: BehandlingRequest) => void;
    behandling?: BehandlingRequest;
    fagsak: Ressurs<Fagsak>;
}

interface INyBehandling {
    behandlingstype: Behandlingstype;
}

const StyledNyBehandlingRad = styled.tr`
    background-color: #cce1f3;
`;

const Behandling: React.FC<Props> = ({ behandling, settBehandling, fagsak }) => {
    const [nyBehandling, settNyBehandling] = useState<INyBehandling>();
    const [harValgtNyBehandling, settHarValgtNyBehandling] = useState<boolean>(false);

    const håndterCheck = (behandlingsId: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                if (behandlingsId === 'ny') {
                    settBehandling({
                        behandlingstype: nyBehandling?.behandlingstype,
                    });
                    settHarValgtNyBehandling(true);
                } else {
                    settBehandling({
                        behandlingsId,
                    });
                    settHarValgtNyBehandling(false);
                }
            } else {
                settBehandling(undefined);
                settHarValgtNyBehandling(false);
            }
        };
    };

    return (
        <DataViewer response={{ fagsak }}>
            {({ fagsak }) => {
                return (
                    <>
                        <Systemtittel>Behandling</Systemtittel>
                        <table className="tabell">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Behandlingstype</th>
                                    <th>Status</th>
                                    <th>Sist endret</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fagsak.behandlinger.map((behandlingsEl: Behandling) => (
                                    <tr key={behandlingsEl.id}>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck(behandlingsEl.id)}
                                                checked={
                                                    behandlingsEl.id === behandling?.behandlingsId
                                                }
                                                label={behandlingsEl.type}
                                            />
                                        </td>
                                        <td>{behandlingsEl.type}</td>
                                        <td>{behandlingsEl.status}</td>
                                        <td>{formaterIsoDatoTid(behandlingsEl.sistEndret)}</td>
                                    </tr>
                                ))}
                                {nyBehandling && (
                                    <StyledNyBehandlingRad>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck('ny')}
                                                checked={harValgtNyBehandling}
                                                label={'ny'}
                                            />
                                        </td>
                                        <td>{nyBehandling.behandlingstype}</td>
                                        <td>NY</td>
                                        <td>–</td>
                                    </StyledNyBehandlingRad>
                                )}
                            </tbody>
                        </table>
                        {fagsak.behandlinger.every(
                            (behandling: Behandling) => behandling.status !== 'UTREDES'
                        ) &&
                            !nyBehandling && (
                                <Flatknapp
                                    onClick={() => {
                                        settNyBehandling({
                                            behandlingstype: fagsak.behandlinger.length
                                                ? Behandlingstype.REVURDERING
                                                : Behandlingstype.FØRSTEGANGSBEHANDLING,
                                        });
                                    }}
                                >
                                    <LeggtilMedSirkel />
                                    <span>Opprett ny behandling</span>
                                </Flatknapp>
                            )}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Behandling;
