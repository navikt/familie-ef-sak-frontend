import React, { useMemo } from 'react';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PensjonsgivendeInntekt } from '../../App/typer/personinntekt';
import { Table } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ressurs } from '../../App/typer/ressurs';

const StyledTable = styled.table`
    width: 70%;
    padding: 2rem;
    margin-left: 1rem;
    td {
        padding: 0.75rem;
    }
`;

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
    const pensjonsgivendeInntekter = useDataHenter<PensjonsgivendeInntekt[], null>(inntektConfig);

    return <PensjonsgivendeInntektTabell pensjonsgivendeInntekter={pensjonsgivendeInntekter} />;
};

const PensjonsgivendeInntektTabell: React.FC<{
    pensjonsgivendeInntekter: Ressurs<PensjonsgivendeInntekt[]>;
}> = ({ pensjonsgivendeInntekter }) => {
    return (
        <DataViewer response={{ pensjonsgivendeInntekter }}>
            {({ pensjonsgivendeInntekter }) => {
                if (!pensjonsgivendeInntekter.length) {
                    return null;
                }
                return (
                    <StyledTable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Inntektsår</Table.HeaderCell>
                                <Table.HeaderCell>Pensjonsgivende inntekt</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {pensjonsgivendeInntekter.map((pensjonsgivendeInntekt) => {
                                return (
                                    <Table.Row key={pensjonsgivendeInntekt.inntektsaar}>
                                        <Table.DataCell>
                                            {pensjonsgivendeInntekt.inntektsaar}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {pensjonsgivendeInntekt.verdi}
                                        </Table.DataCell>
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
