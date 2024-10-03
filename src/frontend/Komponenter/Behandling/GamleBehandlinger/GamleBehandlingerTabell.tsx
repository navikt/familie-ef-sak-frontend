import React from 'react';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { behandlingsårsakTilTekst } from '../../../App/typer/behandlingsårsak';
import { PartialRecord } from '../../../App/typer/common';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { SortState, Table } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { Link } from 'react-router-dom';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { useSorteringState } from '../../../App/hooks/felles/useSorteringState';

const TabellData: PartialRecord<keyof Behandling, string> = {
    opprettet: 'Behandling opprettetdato',
    stønadstype: 'Stønadstype',
    type: 'Type',
    behandlingsårsak: 'Årsak',
    resultat: 'Resultat',
};

export const GamleBehandlingerTabell: React.FC<{
    gamleBehandlinger: Behandling[];
}> = ({ gamleBehandlinger }) => {
    const { sortertListe, settSortering, sortConfig } = useSorteringState(gamleBehandlinger, {
        orderBy: 'opprettet',
        direction: 'ascending',
    });

    return (
        <Table
            zebraStripes={true}
            sort={sortConfig as SortState}
            onSortChange={(sortKey) => settSortering(sortKey as keyof Behandling)}
        >
            <Table.Header>
                <Table.Row>
                    {Object.entries(TabellData).map(([felt, tekst], index) => (
                        <Table.ColumnHeader key={`${index}${felt}`} sortKey={felt} sortable={true}>
                            {tekst}
                        </Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortertListe.map((behandling) => {
                    return (
                        <Table.Row key={behandling.id}>
                            <Table.DataCell scope="row">
                                {formaterIsoDato(behandling.opprettet)}
                            </Table.DataCell>
                            <Table.DataCell scope="row">
                                {stønadstypeTilTekst[behandling.stønadstype]}
                            </Table.DataCell>
                            <Table.DataCell scope="row">
                                {behandlingstypeTilTekst[behandling.type]}
                            </Table.DataCell>
                            <Table.DataCell scope="row">
                                {behandlingsårsakTilTekst[behandling.behandlingsårsak]}
                            </Table.DataCell>
                            <Table.DataCell>
                                <Link
                                    className="lenke"
                                    to={{
                                        pathname: `/behandling/${behandling.id}`,
                                    }}
                                >
                                    {behandlingResultatTilTekst[behandling.resultat]}
                                </Link>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
