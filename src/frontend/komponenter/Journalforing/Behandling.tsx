import { Systemtittel } from 'nav-frontend-typografi';
import React, { useMemo, useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { AxiosRequestConfig } from 'axios';
import DataFetcher from '../../komponenter/Felleskomponenter/DataFetcher/DataFetcher';
import { tilLokalDatoStreng } from '../../utils/date';
import { behandlingstemaTilStønadstype, Behandlingstema } from '../Oppgavebenk/behandlingstema';

interface Props {
    personIdent: string;
    behandlingstema?: Behandlingstema;
}

const Behandling: React.FC<Props> = ({ personIdent, behandlingstema }) => {
    const [valgtBehandling, settValgtBehandling] = useState<string>('');

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
                            </tbody>
                        </table>
                    </>
                );
            }}
        </DataFetcher>
    );
};

export default Behandling;
