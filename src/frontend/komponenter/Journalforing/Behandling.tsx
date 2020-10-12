import { Systemtittel } from 'nav-frontend-typografi';
import React, { useMemo, useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { AxiosRequestConfig } from 'axios';
import DataFetcher from '../../komponenter/Felleskomponenter/DataFetcher/DataFetcher';
import { tilLokalDatoStreng } from '../../utils/date';
import { behandlingstemaTilStønadstype, Behandlingstema } from '../Oppgavebenk/behandlingstema';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilSirkel from '../../ikoner/LeggtilSirkel';
import styled from 'styled-components';

interface Props {
    personIdent: string;
    behandlingstema?: Behandlingstema;
}

enum Behandlingstype {
    'FØRSTEGANGSBEHANDLING' = 'FØRSTEGANGSBEHANDLING',
    'REVURDERING' = 'REVURDERING',
}

interface INyBehandling {
    behandlingstype: Behandlingstype;
}

const StyledNyBehandlingRad = styled.tr`
    background-color: #cce1f3;
`;

const Behandling: React.FC<Props> = ({ personIdent, behandlingstema }) => {
    const [valgtBehandling, settValgtBehandling] = useState<string>('');
    const [nyBehandling, settNyBehandling] = useState<INyBehandling>();

    const stønadstype = behandlingstemaTilStønadstype(behandlingstema);

    const config: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak`,
            data: { personIdent, stønadstype },
        }),
        [stønadstype, personIdent]
    );

    const håndterCheck = (behandlingId: string) => {
        return (e: any) => {
            if (e.target.checked) {
                settValgtBehandling(behandlingId);
            } else {
                settValgtBehandling('');
            }
        };
    };

    return (
        <DataFetcher config={config}>
            {(data: any) => {
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
                                {data.behandlinger.map((behandling: any) => (
                                    <tr key={behandling.id}>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck(behandling.id)}
                                                checked={behandling.id === valgtBehandling}
                                                label={behandling.type}
                                            />
                                        </td>
                                        <td>{behandling.type}</td>
                                        <td>{behandling.status}</td>
                                        <td>{tilLokalDatoStreng(behandling.sistEndret)}</td>
                                    </tr>
                                ))}
                                {nyBehandling && (
                                    <StyledNyBehandlingRad>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck('ny')}
                                                checked={'ny' === valgtBehandling}
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
                        {data.behandlinger.every(
                            (behandling: any) => behandling.status !== 'UTREDES'
                        ) &&
                            !nyBehandling && (
                                <Flatknapp
                                    onClick={() => {
                                        settNyBehandling({
                                            behandlingstype: data.behandlinger.length
                                                ? Behandlingstype.REVURDERING
                                                : Behandlingstype.FØRSTEGANGSBEHANDLING,
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
