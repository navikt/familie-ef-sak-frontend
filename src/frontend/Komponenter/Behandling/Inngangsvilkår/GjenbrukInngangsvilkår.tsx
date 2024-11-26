import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Link } from '@navikt/ds-react';
import { behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { Table } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

export const GjenbrukInngangsvilkår: React.FC = () => {
    const { behandlinger } = useBehandling();
    const [visForrigeBehandlinger, settVisForrigeBehandlinger] = useState<boolean>(false);

    return (
        <DataViewer response={{ behandlinger }}>
            {({ behandlinger }) => {
                const behandlingSomBlirGjenbrukt = behandlinger.slice(0, 1);

                return (
                    <Alert variant={'info'} size="small">
                        <Button
                            type={'button'}
                            variant={'tertiary'}
                            icon={visForrigeBehandlinger ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            iconPosition={'right'}
                            onClick={() => {
                                settVisForrigeBehandlinger((prevState) => !prevState);
                            }}
                            size={'xsmall'}
                        >
                            Forrige behandling som brukes til gjenbruk
                        </Button>

                        {visForrigeBehandlinger && (
                            <Table size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell textSize="small" scope="col">
                                            Stønadstype
                                        </Table.HeaderCell>
                                        <Table.HeaderCell textSize="small" scope="col">
                                            Behandlingstype
                                        </Table.HeaderCell>
                                        <Table.HeaderCell textSize="small" scope="col">
                                            Status
                                        </Table.HeaderCell>
                                        <Table.HeaderCell textSize="small" scope="col">
                                            Vedtaksdato
                                        </Table.HeaderCell>
                                        <Table.HeaderCell textSize="small" scope="col">
                                            Resultat
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {behandlingSomBlirGjenbrukt.map((behandling) => {
                                        return (
                                            <Table.Row key={behandling.id}>
                                                <Table.DataCell textSize="small" scope="row">
                                                    {stønadstypeTilTekst[behandling.stønadstype]}
                                                </Table.DataCell>
                                                <Table.DataCell textSize="small">
                                                    <Link
                                                        href={`/behandling/${behandling.id}/inngangsvilkar`}
                                                        target={'_blank'}
                                                    >
                                                        {behandlingstypeTilTekst[behandling.type]}
                                                        <ExternalLinkIcon />
                                                    </Link>
                                                </Table.DataCell>
                                                <Table.DataCell textSize="small">
                                                    {behandlingStatusTilTekst[behandling.status]}
                                                </Table.DataCell>
                                                <Table.DataCell textSize="small">
                                                    {behandling.vedtaksdato &&
                                                        formaterIsoDato(behandling.vedtaksdato)}
                                                </Table.DataCell>
                                                <Table.DataCell textSize="small">
                                                    {
                                                        behandlingResultatTilTekst[
                                                            behandling.resultat
                                                        ]
                                                    }
                                                </Table.DataCell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        )}
                    </Alert>
                );
            }}
        </DataViewer>
    );
};
