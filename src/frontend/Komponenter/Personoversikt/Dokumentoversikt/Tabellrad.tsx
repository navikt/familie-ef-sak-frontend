import React, { Dispatch, SetStateAction } from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { skalViseLenke } from '../utils';
import { IkkeTilgang } from './Hovedtabellrad';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import { Dokumenttittel } from './Dokumenttittel';

interface Props {
    dokument: Dokumentinfo;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
}

export const Tabellrad: React.FC<Props> = ({ dokument, settValgtDokumentId }) => {
    return (
        <Table.Row>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell>
                {skalViseLenke(dokument) ? (
                    <Dokumenttittel
                        dokument={dokument}
                        settValgtDokumentId={settValgtDokumentId}
                        erHovedDokument={false}
                    />
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
