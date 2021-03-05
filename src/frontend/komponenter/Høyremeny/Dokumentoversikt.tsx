import * as React from 'react';
import { useMemo, useState } from 'react';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';
import { saveAs } from 'file-saver';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import Dokumentliste, { DokumentProps } from '@navikt/familie-dokumentliste';
import { base64toBlob } from '../../utils/utils';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../../typer/routing';
import hiddenIf from '../Felleskomponenter/HiddenIf/hiddenIf';

const Dokumentoversikt: React.FC = () => {
    const { axiosRequest } = useApp();
    const { behandlingId } = useParams<IBehandlingParams>();

    const [lastNedDokumentFeilet, settLastNedDokumentFeilet] = useState<string>();

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );
    const dokumentResponse: Ressurs<DokumentProps[]> = useDataHenter<DokumentProps[], null>(
        dokumentConfig
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
            <DataViewer response={{ dokumentResponse }}>
                {({ dokumentResponse }) => {
                    return (
                        <Dokumentliste dokumenter={dokumentResponse} onClick={lastNedDokument} />
                    );
                }}
            </DataViewer>
        </>
    );
};

export default hiddenIf(Dokumentoversikt);
