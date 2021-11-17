import React, { useMemo } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';

import { AxiosRequestConfig } from 'axios';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { TabellWrapper, Td } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import { groupBy, åpneFilIEgenTab } from '../../App/utils/utils';
import { tekstMapping } from '../../App/utils/tekstmapping';
import { journalstatusTilTekst } from '../../App/typer/journalforing';

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

    const Tabellrad: React.FC<{ dokument: Dokumentinfo }> = ({ dokument }) => (
        <tr>
            <Td></Td>
            <Td
                style={{
                    marginLeft: '2rem',
                }}
            >
                <LenkeVenstrePadding onClick={() => hentDokument(dokument)} href={'#'}>
                    {dokument.tittel}
                </LenkeVenstrePadding>
            </Td>
            <Td></Td>
        </tr>
    );

    const HovedTabellrad: React.FC<{ dokument: Dokumentinfo }> = ({ dokument }) => (
        <TrHoveddokument>
            <Td>{formaterNullableIsoDatoTid(dokument.dato)}</Td>
            <Td>
                <Lenke onClick={() => hentDokument(dokument)} href={'#'}>
                    {dokument.tittel}
                </Lenke>
            </Td>
            <Td>
                <Normaltekst>
                    {tekstMapping(dokument.journalstatus, journalstatusTilTekst)}
                </Normaltekst>
            </Td>
        </TrHoveddokument>
    );

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const grupperteDokumenter = groupBy(dokumentResponse, (i) => i.journalpostId);

                console.log('g', grupperteDokumenter);

                return (
                    <>
                        <DokumenterVisning>
                            <TabellWrapper>
                                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                                <table className="tabell">
                                    <thead>
                                        <Kolonnetittel text={'Dato'} width={15} />
                                        <Kolonnetittel text={'Tittel'} width={75} />
                                        <Kolonnetittel text={'Status'} width={10} />
                                    </thead>
                                    <tbody>
                                        {Object.keys(grupperteDokumenter)
                                            .sort(function (a, b) {
                                                return grupperteDokumenter[a][0].dato >
                                                    grupperteDokumenter[b][0].dato
                                                    ? -1
                                                    : 1;
                                            })
                                            .map((journalpostId: string) => {
                                                return grupperteDokumenter[journalpostId].map(
                                                    (dokument: Dokumentinfo, indeks: number) => {
                                                        if (indeks === 0) {
                                                            return (
                                                                <HovedTabellrad
                                                                    key={`${journalpostId}-${indeks}`}
                                                                    dokument={dokument}
                                                                />
                                                            );
                                                        } else
                                                            return (
                                                                <Tabellrad
                                                                    key={`${journalpostId}-${indeks}`}
                                                                    dokument={dokument}
                                                                />
                                                            );
                                                    }
                                                );
                                            })}
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
