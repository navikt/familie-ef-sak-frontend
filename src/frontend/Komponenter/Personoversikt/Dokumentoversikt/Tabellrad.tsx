import React, { Dispatch, SetStateAction } from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { skalViseLenke } from '../utils';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import { Dokumenttittel } from './Dokumenttittel';
import styled from 'styled-components';

interface Props {
    dokument: Dokumentinfo;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
    dokumentHarBlittBesøkt: boolean;
    oppdaterBesøkteDokumentLenker: () => void;
}

const IkkeTilgang = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const Tabellrad: React.FC<Props> = ({
    dokument,
    settValgtDokumentId,
    dokumentHarBlittBesøkt,
    oppdaterBesøkteDokumentLenker,
}) => {
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
                        dokumentHarBlittBesøkt={dokumentHarBlittBesøkt}
                        oppdaterBesøkteDokumentLenker={oppdaterBesøkteDokumentLenker}
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
