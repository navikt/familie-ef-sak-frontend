import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { GammelBehandling } from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Table } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { formatterEnumVerdi } from '../../../App/utils/utils';

const StyledGamleBehandlinger = styled.div`
    width: inherit;
`;

const GamleBehandlinger = () => {
    const { axiosRequest } = useApp();
    const [gamleBehandlinger, settGamleBehandlinger] = useState<Ressurs<GammelBehandling[]>>(
        byggTomRessurs()
    );

    useEffect(() => {
        axiosRequest<GammelBehandling[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/gamlebehandlinger`,
        }).then((res: Ressurs<GammelBehandling[]>) => settGamleBehandlinger(res));
    }, [axiosRequest]);

    return (
        <DataViewer response={{ gamleBehandlinger }}>
            {({ gamleBehandlinger }) => (
                <StyledGamleBehandlinger>
                    <h1>Gamle behandlinger</h1>
                    <>
                        <Table size="medium">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope="col">
                                        Behandling opprettetdato
                                    </Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Stønadstype</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Årsak</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {gamleBehandlinger.map((behandling, i) => {
                                    return (
                                        <Table.Row key={i}>
                                            <Table.DataCell scope="row">
                                                {formaterIsoDato(behandling.opprettet)}
                                            </Table.DataCell>
                                            <Table.DataCell scope="row">
                                                {behandling.stønadstype}
                                            </Table.DataCell>
                                            <Table.DataCell scope="row">
                                                {behandling.årsak}
                                            </Table.DataCell>
                                            <Table.DataCell scope="row">
                                                {behandling.type}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                <Link
                                                    className="lenke"
                                                    to={{
                                                        pathname: `/behandling/${behandling.id}`,
                                                    }}
                                                >
                                                    {formatterEnumVerdi(behandling.resultat)}
                                                </Link>
                                            </Table.DataCell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </>
                </StyledGamleBehandlinger>
            )}
        </DataViewer>
    );
};

export default GamleBehandlinger;
