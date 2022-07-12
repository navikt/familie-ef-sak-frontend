import React from 'react';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { PartialRecord } from '../../../App/typer/common';
import {
    Behandling,
    BehandlingResultat,
    behandlingResultatTilTekst,
} from '../../../App/typer/fagsak';
import {
    TilbakekrevingBehandlingsresultatstype,
    TilbakekrevingBehandlingstype,
} from '../../../App/typer/tilbakekreving';
import { Table } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { behandlingsårsakTilTekst } from '../../../App/typer/Behandlingsårsak';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import SorteringsHeader from '../../Oppgavebenk/OppgaveSorteringHeader';
import { useSorteringState } from '../../../App/hooks/felles/useSorteringState';
import styled from 'styled-components';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';

const StyledTable = styled(Table)`
    padding: 2rem;
`;

interface GamleBehandlingerTabell {
    id: string;
    opprettet: string;
    stønadstype: Stønadstype;
    type: Behandlingstype | TilbakekrevingBehandlingstype;
    behandlingsårsak?: Behandlingsårsak;
    resultat?: BehandlingResultat | TilbakekrevingBehandlingsresultatstype;
}

const TabellData: PartialRecord<keyof GamleBehandlingerTabell, string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    stønadstype: 'Stønadstype',
    behandlingsårsak: 'Årsak',
    resultat: 'Resultat',
};

export const GamleBehandlingerTabell: React.FC<{
    gamleBehandlinger: Behandling[];
}> = ({ gamleBehandlinger }) => {
    const { sortertListe, settSortering, sortConfig } = useSorteringState<GamleBehandlingerTabell>(
        gamleBehandlinger,
        {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'ascending',
        }
    );

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
                            onClick={() => settSortering(felt as keyof GamleBehandlingerTabell)}
                            key={`${index}${felt}`}
                        />
                    ))}{' '}
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
                                {
                                    behandlingsårsakTilTekst[
                                        behandling.behandlingsårsak as Behandlingsårsak
                                    ]
                                }
                            </Table.DataCell>
                            <Table.DataCell scope="row">
                                {behandlingstypeTilTekst[behandling.type as Behandlingstype]}
                            </Table.DataCell>
                            <Table.DataCell scope="row">
                                {stønadstypeTilTekst[behandling.stønadstype as Stønadstype]}
                            </Table.DataCell>
                            <Table.DataCell>
                                <Link
                                    className="lenke"
                                    to={{
                                        pathname: `/behandling/${behandling.id}`,
                                    }}
                                >
                                    {
                                        behandlingResultatTilTekst[
                                            behandling.resultat as BehandlingResultat
                                        ]
                                    }
                                </Link>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </StyledTable>
    );
};
