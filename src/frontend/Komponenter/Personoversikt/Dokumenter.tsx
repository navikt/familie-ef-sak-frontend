import React, { useState } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { useMemo } from 'react';

import { AxiosRequestConfig } from 'axios';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { base64toBlob } from '../../App/utils/utils';
import { saveAs } from 'file-saver';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import { DokumentProps } from '@navikt/familie-dokumentliste';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { useApp } from '../../App/context/AppContext';
import { Hovedknapp } from 'nav-frontend-knapper';
import { TabellWrapper, Td } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

const DokumentVisning = styled.div`
    display: flex;
    flex-direction: column;
`;

const lagDokumentliste = (dokumentResponse: any) => {
    return dokumentResponse.flatMap((journalpost: any) => {
        return journalpost.dokumenter.map((dokument: any) => {
            return {
                ...dokument,
                dato: formaterNullableIsoDatoTid(journalpost.datoMottatt),
                journalpostId: journalpost.journalpostId,
                dokumentinfoId: dokument.dokumentInfoId,
            };
        });
    });
};

const Dokumenter: React.FC<{ personopplysninger: IPersonopplysninger }> = ({
    personopplysninger,
}) => {
    const { axiosRequest } = useApp();
    const [dokumentFil, settDokumentFil] = useState<any>();
    const [vistDokument, settVistDokument] = useState<any>();
    const [lastNedDokumentFeilet, settLastNedDokumentFeilet] = useState<string>();

    const hentDokument = (dokument: DokumentProps) => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${dokument.journalpostId}/dokument/${dokument.dokumentinfoId}`,
        }).then((res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    settDokumentFil(res);
                    settVistDokument(dokument);
                    break;
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                case RessursStatus.FEILET:
                    break;
                default:
                    break;
            }
        });
    };

    const lastNedDokument = (dokument: DokumentProps) => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${dokument.journalpostId}/dokument/${dokument.dokumentinfoId}`,
        }).then((res: Ressurs<string>) => {
            const dokumentnavn =
                dokument.tittel || dokument.filnavn || `dokument-${dokument.journalpostId}`;
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    saveAs(base64toBlob(res.data, 'application/pdf'), `${dokumentnavn}.pdf`);
                    break;
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                case RessursStatus.FEILET:
                    settLastNedDokumentFeilet(res.frontendFeilmelding);
                    break;
                default:
                    break;
            }
        });
    };

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/person/${personopplysninger.personIdent}`,
        }),
        []
    );

    const dokumentResponse = useDataHenter<any[], null>(dokumentConfig);

    const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => (
        <Td width={`${width}%`}>
            <Element>{text}</Element>
        </Td>
    );

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const dokumentListe = lagDokumentliste(dokumentResponse);

                return (
                    <>
                        <DokumentVisning>
                            <TabellWrapper>
                                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                                <table className="tabell">
                                    <thead>
                                        <Kolonnetittel text={'Dato'} width={35} />
                                        <Kolonnetittel text={'Tittel'} width={35} />
                                    </thead>
                                    <tbody>
                                        {dokumentListe.map((dokument: any, indeks: number) => {
                                            return (
                                                <tr key={indeks}>
                                                    <Td>{dokument.dato}</Td>
                                                    <Td>
                                                        <Lenke
                                                            onClick={() => hentDokument(dokument)}
                                                            href={'#'}
                                                        >
                                                            {dokument.tittel}
                                                        </Lenke>
                                                    </Td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </TabellWrapper>
                            {dokumentFil && (
                                <div>
                                    <PdfVisning pdfFilInnhold={dokumentFil} />
                                    <Hovedknapp
                                        onClick={() => {
                                            lastNedDokument(vistDokument);
                                        }}
                                    >
                                        Last ned dokument
                                    </Hovedknapp>
                                </div>
                            )}
                        </DokumentVisning>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Dokumenter;
