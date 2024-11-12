import React from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { skalViseLenke } from '../utils';
import { IkkeTilgang } from './Hovedtabellrad';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import { Dokumenttittel } from './Dokumenttittel';

export const Tabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({
    dokument,
}) => {
    return (
        <Table.Row>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell>
                {skalViseLenke(dokument) ? (
                    <Dokumenttittel dokument={dokument} />
                ) : (
                    <IkkeTilgang>
                        <PadlockLockedIcon title="Mangler tilgang til dokument" />
                        {dokument.tittel}
                    </IkkeTilgang>
                )}
            </Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
        </Table.Row>
    );
};
