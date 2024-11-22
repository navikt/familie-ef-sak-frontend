import React, { Dispatch, SetStateAction } from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { Arkivtema, arkivtemaerTilTekst } from '../../../App/typer/arkivtema';
import { tekstMapping } from '../../../App/utils/tekstmapping';
import {
    avsenderMottakerIdTypeTilTekst,
    journalstatusTilTekst,
} from '../../../App/typer/journalføring';
import styled from 'styled-components';
import { skalViseLenke } from '../utils';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import { JournalpostTag } from '../../Behandling/Høyremeny/Dokumentliste';
import { Dokumenttittel } from './Dokumenttittel';

export const IkkeTilgang = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

interface Props {
    dokument: Dokumentinfo;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
}

export const HovedTabellrad: React.FC<Props> = ({ dokument, settValgtDokumentId }) => {
    return (
        <Table.Row>
            <Table.DataCell>{formaterNullableIsoDatoTid(dokument.dato)}</Table.DataCell>
            <Table.DataCell>
                {<JournalpostTag journalposttype={dokument.journalposttype} />}
            </Table.DataCell>
            <Table.DataCell>{arkivtemaerTilTekst[dokument.tema as Arkivtema]}</Table.DataCell>

            <Table.DataCell>{utledAvsenderMottakerDetaljer(dokument)}</Table.DataCell>
            <Table.DataCell>
                {skalViseLenke(dokument) ? (
                    <Dokumenttittel
                        dokument={dokument}
                        settValgtDokumentId={settValgtDokumentId}
                        erHovedDokument={true}
                    />
                ) : (
                    <>
                        <PadlockLockedIcon title="Mangler tilgang til dokument" />
                        {dokument.tittel}
                    </>
                )}
            </Table.DataCell>
            <Table.DataCell>
                {tekstMapping(dokument.journalstatus, journalstatusTilTekst)}
            </Table.DataCell>
            <Table.DataCell>
                {dokument.utsendingsinfo
                    ? dokument.utsendingsinfo.digitalpostSendt
                        ? 'Digital post sendt'
                        : 'Fysisk post sendt'
                    : ''}
            </Table.DataCell>
        </Table.Row>
    );
};

const utledAvsenderMottakerDetaljer = (dokument: Dokumentinfo): string => {
    let avsender = '';
    const avsenderMottaker = dokument.avsenderMottaker;
    if (!avsenderMottaker) {
        return avsender;
    }
    if (avsenderMottaker.navn) {
        avsender += avsenderMottaker.navn;
    }
    const type = avsenderMottaker.type ? avsenderMottakerIdTypeTilTekst[avsenderMottaker.type] : '';
    const id = avsenderMottaker.id;
    if (!avsenderMottaker.erLikBruker && (type || id)) {
        avsender += ' (';
        if (type) {
            avsender += type;
            if (id) {
                avsender += ': ';
            }
        }
        if (id) {
            avsender += id;
        }
        avsender += ')';
    }
    return avsender;
};
