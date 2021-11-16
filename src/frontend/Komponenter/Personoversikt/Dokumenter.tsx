import React, { useMemo } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';

import { AxiosRequestConfig } from 'axios';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { TabellWrapper, Td } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import { groupBy, åpneFilIEgenTab } from '../../App/utils/utils';

const DokumenterVisning = styled.div`
    display: flex;
    flex-direction: column;
`;

const TrHoveddokument = styled.tr`
    background-color: #f7f7f7;
`;

const LenkeVenstrePadding = styled(Lenke)`
    padding-left: 2rem;
`;

const Dokumenter: React.FC<{ personopplysninger: IPersonopplysninger }> = ({
    personopplysninger,
}) => {
    const hentDokument = (dokument: Dokumentinfo) => {
        åpneFilIEgenTab(
            dokument.journalpostId,
            dokument.dokumentinfoId,
            dokument.tittel || dokument.filnavn || ''
        );
    };

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/person/${personopplysninger.personIdent}`,
        }),
        [personopplysninger.personIdent]
    );

    const dokumentResponse = useDataHenter<Dokumentinfo[], null>(dokumentConfig);

    const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => (
        <Td width={`${width}%`}>
            <Element>{text}</Element>
        </Td>
    );

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const grupperteDokumenter = groupBy(dokumentResponse, (i) => i.journalpostId);

                return (
                    <>
                        <DokumenterVisning>
                            <TabellWrapper>
                                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                                <table className="tabell">
                                    <thead>
                                        <Kolonnetittel text={'Dato'} width={35} />
                                        <Kolonnetittel text={'Tittel'} width={35} />
                                    </thead>
                                    <tbody>
                                        {Object.keys(grupperteDokumenter).map(
                                            (journalpostId: string) => {
                                                return grupperteDokumenter[journalpostId].map(
                                                    (dokument: Dokumentinfo, indeks: number) => {
                                                        if (indeks === 0) {
                                                            return (
                                                                <TrHoveddokument key={indeks}>
                                                                    <Td>
                                                                        {formaterNullableIsoDatoTid(
                                                                            dokument.dato
                                                                        )}
                                                                    </Td>
                                                                    <Td>
                                                                        <Lenke
                                                                            onClick={() =>
                                                                                hentDokument(
                                                                                    dokument
                                                                                )
                                                                            }
                                                                            href={'#'}
                                                                        >
                                                                            {dokument.tittel}
                                                                        </Lenke>
                                                                    </Td>
                                                                </TrHoveddokument>
                                                            );
                                                        } else
                                                            return (
                                                                <tr key={indeks}>
                                                                    <Td></Td>
                                                                    <Td
                                                                        style={{
                                                                            marginLeft: '2rem',
                                                                        }}
                                                                    >
                                                                        <LenkeVenstrePadding
                                                                            onClick={() =>
                                                                                hentDokument(
                                                                                    dokument
                                                                                )
                                                                            }
                                                                            href={'#'}
                                                                        >
                                                                            {dokument.tittel}
                                                                        </LenkeVenstrePadding>
                                                                    </Td>
                                                                </tr>
                                                            );
                                                    }
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </TabellWrapper>
                        </DokumenterVisning>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Dokumenter;
