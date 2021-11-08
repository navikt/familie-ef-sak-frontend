import React, { useMemo, useState } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';

import { AxiosRequestConfig } from 'axios';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { base64toBlob, åpnePdfIEgenTab } from '../../App/utils/utils';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { useApp } from '../../App/context/AppContext';
import { TabellWrapper, Td } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';

const DokumenterVisning = styled.div`
    display: flex;
    flex-direction: column;
`;

const Dokumenter: React.FC<{ personopplysninger: IPersonopplysninger }> = ({
    personopplysninger,
}) => {
    const { axiosRequest } = useApp();
    const [hentDokumentFeilet, settHentDokumentFeilet] = useState<string>();

    const hentDokument = (dokument: Dokumentinfo) => {
        settHentDokumentFeilet('');

        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${dokument.journalpostId}/dokument/${dokument.dokumentinfoId}`,
        }).then((res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    åpnePdfIEgenTab(
                        base64toBlob(res.data, 'application/pdf'),
                        `${dokument.tittel}.pdf`
                    );
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
