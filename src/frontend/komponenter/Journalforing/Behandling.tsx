import { Systemtittel } from 'nav-frontend-typografi';
import React, { useMemo, useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { AxiosRequestConfig } from 'axios';
import DataFetcher from '../../komponenter/Felleskomponenter/DataFetcher/DataFetcher';
import { tilLokalDatoStreng } from '../../utils/date';
import { behandlingstemaTilStønadstype, Behandlingstema } from '../../typer/behandlingstema';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilSirkel from '../../ikoner/LeggtilSirkel';
import styled from 'styled-components';
import { BehandlingType } from '../../typer/behandlingtype';
import { BehandlingDto, Fagsak } from '../../typer/fagsak';
import { BehandlingRequest } from '../../sider/Journalforing';

interface Props {
    personIdent: string;
    behandlingstema?: Behandlingstema;
    settBehandling: (behandling?: BehandlingRequest) => void;
    behandling?: BehandlingRequest;
}

interface INyBehandling {
    behandlingType: BehandlingType;
}

const StyledNyBehandlingRad = styled.tr`
    background-color: #cce1f3;
`;

const Behandling: React.FC<Props> = ({
    behandling,
    settBehandling,
    personIdent,
    behandlingstema,
}) => {
    const [nyBehandling, settNyBehandling] = useState<INyBehandling>();
    const [harValgtNyBehandling, settHarValgtNyBehandling] = useState<boolean>(false);

    const stønadstype = behandlingstemaTilStønadstype(behandlingstema);

    const config: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak`,
            data: { personIdent, stønadstype },
        }),
        [stønadstype, personIdent]
    );

    const håndterCheck = (behandlingsId: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                if (behandlingsId === 'ny') {
                    settBehandling({
                        behandlingType: nyBehandling?.behandlingType,
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
        <DataFetcher config={config}>
            {(data: Fagsak) => {
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
                                {data.behandlinger.map((behandlingsEl: BehandlingDto) => (
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
                                        <td>{tilLokalDatoStreng(behandlingsEl.sistEndret)}</td>
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
                                        <td>{nyBehandling.behandlingType}</td>
                                        <td>NY</td>
                                        <td>–</td>
                                    </StyledNyBehandlingRad>
                                )}
                            </tbody>
                        </table>
                        {data.behandlinger.every(
                            (behandling: BehandlingDto) => behandling.status !== 'UTREDES'
                        ) &&
                            !nyBehandling && (
                                <Flatknapp
                                    onClick={() => {
                                        settNyBehandling({
                                            behandlingType: data.behandlinger.length
                                                ? BehandlingType.REVURDERING
                                                : BehandlingType.FØRSTEGANGSBEHANDLING,
                                        });
                                    }}
                                >
                                    <LeggtilSirkel />
                                    <span>Opprett ny behandling</span>
                                </Flatknapp>
                            )}
                    </>
                );
            }}
        </DataFetcher>
    );
};

export default Behandling;
