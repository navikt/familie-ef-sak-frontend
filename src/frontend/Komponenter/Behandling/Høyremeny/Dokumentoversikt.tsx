import * as React from 'react';
import { useMemo } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { useParams } from 'react-router-dom';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { compareDesc } from 'date-fns';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import Dokumentliste, { DokumentProps } from './Dokumentliste';

type AlleDokument = {
    dokumenterKnyttetTilBehandlingen: DokumentProps[];
    andreDokumenter: DokumentProps[];
};

const sorterDokumentlisten = (dokumentResponse: AlleDokument) => {
    return [
        ...dokumentResponse.dokumenterKnyttetTilBehandlingen,
        ...dokumentResponse.andreDokumenter,
    ]
        .sort((a, b) => {
            if (!a.dato) {
                return 1;
            } else if (!b.dato) {
                return -1;
            }
            return compareDesc(new Date(a.dato), new Date(b.dato));
        })
        .map((dokument) => {
            return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
        });
};

const Dokumentoversikt: React.FC = () => {
    const { behandlingId } = useParams<{ behandlingId: string }>();

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );
    const dokumentResponse = useDataHenter<AlleDokument, null>(dokumentConfig);

    const lastNedDokument = (dokument: DokumentProps) => {
        åpneFilIEgenTab(
            dokument.journalpostId,
            dokument.dokumentinfoId,
            dokument.tittel || dokument.filnavn || ''
        );
    };

    return (
        <>
            <DataViewer response={{ dokumentResponse }}>
                {({ dokumentResponse }) => {
                    const sortertDokumentliste = sorterDokumentlisten(dokumentResponse);
                    return (
                        <Dokumentliste
                            dokumenter={sortertDokumentliste}
                            onClick={lastNedDokument}
                        />
                    );
                }}
            </DataViewer>
        </>
    );
};

export default Dokumentoversikt;
