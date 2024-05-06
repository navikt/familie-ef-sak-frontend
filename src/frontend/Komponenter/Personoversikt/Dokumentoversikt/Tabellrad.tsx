import React from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import styled from 'styled-components';
import { skalViseLenke } from '../utils';
import { IkkeTilgang } from './Hovedtabellrad';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';
import { Table } from '@navikt/ds-react';

const LenkeVenstreMargin = styled.a`
    margin-left: 2rem;

    &:visited {
        color: purple;
    }
`;

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
                    <>
                        <LenkeVenstreMargin
                            href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
                            target={'_blank'}
                            rel={'noreferrer'}
                        >
                            {dokument.tittel}
                        </LenkeVenstreMargin>
                        <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
                    </>
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
