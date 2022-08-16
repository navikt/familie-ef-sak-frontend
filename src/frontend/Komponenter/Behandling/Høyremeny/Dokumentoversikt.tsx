import * as React from 'react';
import { useMemo } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import Dokumentliste, { DokumentProps } from '@navikt/familie-dokumentliste';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../../../App/typer/routing';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import styled from 'styled-components';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { compareDesc } from 'date-fns';
import { åpneFilIEgenTab } from '../../../App/utils/utils';

const StyledDokumentliste = styled(Dokumentliste)`
    .navds-detail,
    .navds-label {
        text-align: left;
    }
`;

const StyledUndertittel = styled(Undertittel)`
    padding: 0.5rem 1rem;
    color: ${navFarger.navGra80};
`;

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
    const { behandlingId } = useParams<IBehandlingParams>();

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
                        <>
                            <StyledUndertittel>Dokumentoversikt</StyledUndertittel>
                            <StyledDokumentliste
                                dokumenter={sortertDokumentliste}
                                onClick={lastNedDokument}
                            />
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};

export default hiddenIf(Dokumentoversikt);
