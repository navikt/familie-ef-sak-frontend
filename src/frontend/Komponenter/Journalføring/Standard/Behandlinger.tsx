import React from 'react';
import { Table, VStack } from '@navikt/ds-react';
import { Fagsak } from '../../../App/typer/fagsak';
import { Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';

interface Props {
    fagsak: Ressurs<Fagsak>;
}

const Behandlinger: React.FC<Props> = ({ fagsak }) => {
    return (
        <DataViewer response={{ fagsak }}>
            {({ fagsak }) => (
                <VStack gap="4">
                    <Table zebraStripes={true}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope={'col'}>Behandling</Table.HeaderCell>
                                <Table.HeaderCell scope={'col'}>Status</Table.HeaderCell>
                                <Table.HeaderCell scope={'col'}>Sist endret</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {fagsak.behandlinger.map((behandling) => (
                                <Table.Row>
                                    <Table.DataCell>
                                        {behandlingstypeTilTekst[behandling.type]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {behandlingStatusTilTekst[behandling.status]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterIsoDatoTid(behandling.sistEndret)}
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <LeggTilKnapp
                        onClick={() => {}}
                        knappetekst={'Opprett ny behandling'}
                        size={'small'}
                    />
                </VStack>
            )}
        </DataViewer>
    );
};

export default Behandlinger;
