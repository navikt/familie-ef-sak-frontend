import * as React from 'react';
import { useMemo } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../../App/hooks/felles/useDataHenter';
import { useParams } from 'react-router-dom';
import { åpneFilIEgenTab } from '../../../../App/utils/utils';
import { Dokumentliste } from './Dokumentliste';
import { Dokumentinfo, sorterOgFiltrerDokumenter } from '../../../../App/typer/dokument';

type AlleDokument = {
    dokumenterKnyttetTilBehandlingen: Dokumentinfo[];
    andreDokumenter: Dokumentinfo[];
};

export const Dokumentoversikt: React.FC = () => {
    const { behandlingId } = useParams<{ behandlingId: string }>();

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );
    const dokumentResponse = useDataHenter<AlleDokument, null>(dokumentConfig);

    const lastNedDokument = (dokument: Dokumentinfo) => {
        åpneFilIEgenTab(
            dokument.journalpostId,
            dokument.dokumentinfoId,
            dokument.tittel || dokument.filnavn || ''
        );
    };

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const alleDokumenter = [
                    ...dokumentResponse.dokumenterKnyttetTilBehandlingen,
                    ...dokumentResponse.andreDokumenter,
                ];

                const dokumentListe = sorterOgFiltrerDokumenter(alleDokumenter);

                return <Dokumentliste dokumenter={dokumentListe} onClick={lastNedDokument} />;
            }}
        </DataViewer>
    );
};
