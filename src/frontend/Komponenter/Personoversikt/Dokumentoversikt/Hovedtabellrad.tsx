import React from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import { Arkivtema, arkivtemaerTilTekst } from '../../../App/typer/arkivtema';
import { tekstMapping } from '../../../App/utils/tekstmapping';
import {
    avsenderMottakerIdTypeTilTekst,
    journalstatusTilTekst,
} from '../../../App/typer/journalføring';
import styled from 'styled-components';
import { skalViseLenke } from '../utils';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';
import { Table } from '@navikt/ds-react';

const HovedLenke = styled.a`
    &:visited {
        color: purple;
    }
`;

// const InnUt = styled.div`
//     svg {
//         vertical-align: -0.2em;
//         margin-right: 0.5rem;
//     }
// `;

export const IkkeTilgang = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const HovedTabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({
    dokument,
}) => {
    return (
        <Table.Row>
            <Table.DataCell>{formaterNullableIsoDatoTid(dokument.dato)}</Table.DataCell>
            <Table.DataCell>{dokument.journalposttype}</Table.DataCell>
            <Table.DataCell>{arkivtemaerTilTekst[dokument.tema as Arkivtema]}</Table.DataCell>

            <Table.DataCell>{utledAvsenderMottakerDetaljer(dokument)}</Table.DataCell>
            <Table.DataCell>
                {skalViseLenke(dokument) ? (
                    <>
                        <HovedLenke
                            key={dokument.journalpostId}
                            href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
                            target={'_blank'}
                            rel={'noreferrer'}
                        >
                            {dokument.tittel}
                        </HovedLenke>
                        <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
                    </>
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
