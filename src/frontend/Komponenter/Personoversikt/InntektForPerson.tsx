import React, { useMemo } from 'react';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PensjonsgivendeInntekt } from '../../App/typer/personinntekt';
import { Table } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ressurs } from '../../App/typer/ressurs';

export const InntektForPerson: React.FC<{
    fagsakPerson: IFagsakPerson;
}> = ({ fagsakPerson }) => {
    const inntektConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/naeringsinntekt/fagsak-person/${fagsakPerson.id}`,
        }),
        [fagsakPerson]
    );
    const pensjonsgivendeInntekt = useDataHenter<PensjonsgivendeInntekt[], null>(inntektConfig);

    return <PensjonsgivendeInntektTabell pensjonsgivendeInntekt={pensjonsgivendeInntekt} />;
};

const PensjonsgivendeInntektTabell: React.FC<{
    pensjonsgivendeInntekt: Ressurs<PensjonsgivendeInntekt[]>;
}> = ({ pensjonsgivendeInntekt }) => {
    return (
        <DataViewer response={{ pensjonsgivendeInntekt }}>
            {({ pensjonsgivendeInntekt }) => {
                if (!pensjonsgivendeInntekt.length) {
                    return null;
                }
                return (
                    <StyledTable>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Inntektsår</Table.ColumnHeader>
                                <Table.ColumnHeader>Pensjonsgivende inntekt</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {pensjonsgivendeInntekt.map((inntekt) => {
                                return (
                                    <Table.Row key={inntekt.inntektsaar}>
                                        <Table.DataCell>{inntekt.verdi}</Table.DataCell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </StyledTable>
                );
            }}
        </DataViewer>
    );
};

const StyledTable = styled.table`
    width: 70%;
    padding: 2rem;
    margin-left: 1rem;
    td {
        padding: 0.75rem;
    }
`;
