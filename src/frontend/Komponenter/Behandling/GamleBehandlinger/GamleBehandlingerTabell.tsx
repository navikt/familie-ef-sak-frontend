import React from 'react';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { behandlingsårsakTilTekst } from '../../../App/typer/Behandlingsårsak';
import { PartialRecord } from '../../../App/typer/common';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { Table } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { Link } from 'react-router-dom';
import SorteringsHeader from '../../Oppgavebenk/OppgaveSorteringHeader';
import { useSorteringState } from '../../../App/hooks/felles/useSorteringState';
import styled from 'styled-components';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';

const StyledTable = styled(Table)`
    padding: 2rem;
`;

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
        sorteringsfelt: 'opprettet',
        rekkefolge: 'ascending',
    });

    return (
        <StyledTable className="tabell" size="medium" zebraStripes={true}>
            <Table.Header>
                <Table.Row>
                    {Object.entries(TabellData).map(([felt, tekst], index) => (
                        <SorteringsHeader
                            rekkefolge={
                                sortConfig?.sorteringsfelt === felt
                                    ? sortConfig?.rekkefolge
                                    : undefined
                            }
                            tekst={tekst}
                            onClick={() => settSortering(felt as keyof Behandling)}
                            key={`${index}${felt}`}
                        />
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
        </StyledTable>
    );
};
