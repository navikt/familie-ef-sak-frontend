import React, { useMemo } from 'react';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PensjonsgivendeInntekt } from '../../App/typer/personinntekt';
import { Table } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ressurs } from '../../App/typer/ressurs';
import { formaterTallMedTusenSkille } from '../../App/utils/formatter';

const Container = styled.div`
    width: max-content;
    text-align: end;
    padding: 2rem 0 0 3rem;
`;

const HøyrestiltDataCell = styled(Table.DataCell)`
    text-align: end;
`;

const HøyrestiltHeaderCell = styled(Table.HeaderCell)`
    text-align: end;
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

                const harInntektFraSvalbard = pensjonsgivendeInntekter.some(
                    (pensjonsgivendeInntekt) => pensjonsgivendeInntekt.svalbard
                );

                return (
                    <Container>
                        <Table size="small">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Inntektsår</Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Total pensjonsgivende inntekt
                                    </Table.HeaderCell>
                                    <HøyrestiltHeaderCell>Arbeidstaker</HøyrestiltHeaderCell>
                                    <HøyrestiltHeaderCell>Næring</HøyrestiltHeaderCell>
                                    {harInntektFraSvalbard && (
                                        <>
                                            <HøyrestiltHeaderCell>
                                                Svalbard arbeidstaker
                                            </HøyrestiltHeaderCell>
                                            <HøyrestiltHeaderCell>
                                                Svalbard næring
                                            </HøyrestiltHeaderCell>
                                        </>
                                    )}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {pensjonsgivendeInntekter.map((pensjonsgivendeInntekt) => {
                                    return (
                                        <Table.Row key={pensjonsgivendeInntekt.inntektsår}>
                                            <Table.DataCell>
                                                {pensjonsgivendeInntekt.inntektsår}
                                            </Table.DataCell>
                                            <HøyrestiltDataCell>
                                                {formaterTallMedTusenSkille(
                                                    pensjonsgivendeInntekt.næring +
                                                        pensjonsgivendeInntekt.person +
                                                        (pensjonsgivendeInntekt.svalbard
                                                            ? pensjonsgivendeInntekt.svalbard
                                                                  ?.næring
                                                            : 0) +
                                                        (pensjonsgivendeInntekt.svalbard
                                                            ? pensjonsgivendeInntekt.svalbard
                                                                  ?.person
                                                            : 0)
                                                )}
                                            </HøyrestiltDataCell>
                                            <HøyrestiltDataCell>
                                                {formaterTallMedTusenSkille(
                                                    pensjonsgivendeInntekt.person
                                                )}
                                            </HøyrestiltDataCell>
                                            <HøyrestiltDataCell>
                                                {formaterTallMedTusenSkille(
                                                    pensjonsgivendeInntekt.næring
                                                )}
                                            </HøyrestiltDataCell>
                                            {harInntektFraSvalbard && (
                                                <>
                                                    <HøyrestiltDataCell>
                                                        {formaterTallMedTusenSkille(
                                                            pensjonsgivendeInntekt.svalbard?.person
                                                        )}
                                                    </HøyrestiltDataCell>
                                                    <HøyrestiltDataCell>
                                                        {formaterTallMedTusenSkille(
                                                            pensjonsgivendeInntekt.svalbard?.næring
                                                        )}
                                                    </HøyrestiltDataCell>
                                                </>
                                            )}
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Container>
                );
            }}
        </DataViewer>
    );
};
