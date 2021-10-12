import React, { useState } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { useMemo } from 'react';

import { AxiosRequestConfig } from 'axios';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { base64toBlob } from '../../App/utils/utils';
import { saveAs } from 'file-saver';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { useApp } from '../../App/context/AppContext';
import { Hovedknapp } from 'nav-frontend-knapper';
import { TabellWrapper, Td } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';

const DokumentMedTittel = styled.div`
    display: flex;

    flex-direction: column;
`;

const DokumentTittel = styled.h3`
    text-align: center;
`;

const DokumenterVisning = styled.div`
    display: flex;
    flex-direction: column;
`;

const DokumentVisning = styled.div`
    margin-top: 2rem;
    display: flex;

    flex-direction: row;
`;

const Dokumenter: React.FC<{ personopplysninger: IPersonopplysninger }> = ({
    personopplysninger,
}) => {
    const { axiosRequest } = useApp();
    const [dokumentFil, settDokumentFil] = useState<Ressurs<string>>();
    const [vistDokument, settVistDokument] = useState<Dokumentinfo>();
    const [hentDokumentFeilet, settHentDokumentFeilet] = useState<string>();

    const hentDokument = (dokument: Dokumentinfo) => {
        settHentDokumentFeilet('');

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
                    settHentDokumentFeilet(res.frontendFeilmelding);
                    break;
                default:
                    break;
            }
        });
    };

    const lastNedDokument = (dokument: Dokumentinfo) => {
        settHentDokumentFeilet('');

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
                    settHentDokumentFeilet(res.frontendFeilmelding);
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
                                        {dokumentResponse.map(
                                            (dokument: Dokumentinfo, indeks: number) => {
                                                return (
                                                    <tr key={indeks}>
                                                        <Td>
                                                            {formaterNullableIsoDatoTid(
                                                                dokument.dato
                                                            )}
                                                        </Td>
                                                        <Td>
                                                            <Lenke
                                                                onClick={() =>
                                                                    hentDokument(dokument)
                                                                }
                                                                href={'#'}
                                                            >
                                                                {dokument.tittel}
                                                            </Lenke>
                                                        </Td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </TabellWrapper>
                            {dokumentFil?.status === RessursStatus.SUKSESS && vistDokument && (
                                <DokumentVisning>
                                    <DokumentMedTittel>
                                        <DokumentTittel>{vistDokument?.tittel}</DokumentTittel>
                                        <PdfVisning pdfFilInnhold={dokumentFil} />
                                    </DokumentMedTittel>
                                    <div>
                                        <Hovedknapp
                                            onClick={() => {
                                                lastNedDokument(vistDokument);
                                            }}
                                        >
                                            Last ned dokument
                                        </Hovedknapp>
                                    </div>
                                </DokumentVisning>
                            )}
                            {hentDokumentFeilet && (
                                <AlertStripeFeil>{hentDokumentFeilet}</AlertStripeFeil>
                            )}
                        </DokumenterVisning>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Dokumenter;
