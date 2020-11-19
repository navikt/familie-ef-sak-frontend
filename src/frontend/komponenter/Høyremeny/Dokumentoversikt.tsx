import * as React from 'react';
import { useState } from 'react';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';
import { saveAs } from 'file-saver';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import Dokumentliste, { DokumentProps } from '@navikt/familie-dokumentliste';
import { base64toBlob } from '../../utils/utils';

interface DokumentoversiktProps {
    dokumentResponse: Ressurs<DokumentProps[]>;
}

const Dokumentoversikt: React.FC<DokumentoversiktProps> = ({ dokumentResponse }) => {
    const { axiosRequest } = useApp();

    const [lastNedDokumentFeilet, settLastNedDokumentFeilet] = useState<string | undefined>(
        undefined
    );

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

    return (
        <>
            {lastNedDokumentFeilet && <AlertStripeFeil>{lastNedDokumentFeilet}</AlertStripeFeil>}
            <DataViewer response={dokumentResponse}>
                {(data: DokumentProps[]) => {
                    return <Dokumentliste dokumenter={data} onClick={lastNedDokument} />;
                }}
            </DataViewer>
        </>
    );
};

export default Dokumentoversikt;
