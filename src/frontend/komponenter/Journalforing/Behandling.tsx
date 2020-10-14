import { Systemtittel } from 'nav-frontend-typografi';
import React, { useEffect, useMemo, useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { AxiosRequestConfig } from 'axios';
import { tilLokalDatoStreng } from '../../utils/date';
import { behandlingstemaTilStønadstype, Behandlingstema } from '../../typer/behandlingstema';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilSirkel from '../../ikoner/LeggtilSirkel';
import styled from 'styled-components';
import { BehandlingType } from '../../typer/behandlingtype';
import { BehandlingDto, Fagsak } from '../../typer/fagsak';
import { BehandlingRequest } from '../../sider/Journalforing';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { useDataHenter } from '../../hooks/useDataHenter';
import { RessursStatus } from '../../typer/ressurs';

interface Props {
    personIdent: string;
    behandlingstema?: Behandlingstema;
    settBehandling: (behandling?: BehandlingRequest) => void;
    settFagsakId: (fagsakId: string) => void;
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
    settFagsakId,
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

    const fagsak = useDataHenter<Fagsak, { personIdent: string; stønadstype: string }>(config);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            settFagsakId(fagsak.data.id);
        }
    }, [fagsak]);

    return (
        <DataViewer response={fagsak}>
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
        </DataViewer>
    );
};

export default Behandling;
