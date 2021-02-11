import React, { useMemo } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Etikett from 'nav-frontend-etiketter';
import Visittkort from '@navikt/familie-visittkort';
import { kjønnType } from '@navikt/familie-typer';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import { useParams } from 'react-router';
import { Fagsak } from '../typer/fagsak';
import DataViewer from '../komponenter/Felleskomponenter/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';

const Fagsakoversikt: React.FC = () => {
    const { fagsakId } = useParams<{ fagsakId: string }>();

    const a: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const fagsak = useDataHenter<Fagsak, null>(a);

    return (
        <DataViewer response={fagsak}>
            {(data) => {
                return (
                    <>
                        <Visittkort
                            alder={19}
                            ident="10008999321"
                            kjønn={kjønnType.MANN}
                            navn="Batman"
                        />
                        <div style={{ display: 'flex' }}>
                            <Systemtittel tag="h3">Fagsak: Overgansstønad</Systemtittel>
                            <Etikett type="info">Opprettet</Etikett>
                        </div>
                        <FagsakoversiktTabell behandlinger={data.behandlinger} />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Fagsakoversikt;

const FagsakoversiktTabell: React.FC<Pick<Fagsak, 'behandlinger'>> = ({ behandlinger }) => {
    return (
        <table className="tabell">
            <thead>
                <tr>
                    <th role="columnheader">Behandling opprettetdato</th>
                    <th role="columnheader">Type</th>
                    <th role="columnheader">Status</th>
                    <th role="columnheader">Resultat</th>
                </tr>
            </thead>
            <tbody>
                {behandlinger.map((behandling) => {
                    return (
                        <tr>
                            <td>{behandling.opprettet}</td>
                            <td>{behandling.type}</td>
                            <td>{behandling.status}</td>
                            <td>{behandling.resultat}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
