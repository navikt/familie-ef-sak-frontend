import * as React from 'react';
import { useMemo, useState } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { saveAs } from 'file-saver';
import Dokumentliste, { DokumentProps } from '@navikt/familie-dokumentliste';
import { base64toBlob } from '../../../App/utils/utils';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../../../App/typer/routing';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import styled from 'styled-components';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { compareDesc } from 'date-fns';

const StyledDokumentliste = styled(Dokumentliste)`
    .typo-element,
    .typo-undertekst {
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
            if (a.dato === undefined) {
                return 1;
            } else if (b.dato === undefined) {
                return -1;
            }
            return compareDesc(new Date(a.dato), new Date(b.dato));
        })
        .map((dokument) => {
            return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
        });
};

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
    const dokumentResponse = useDataHenter<AlleDokument, null>(dokumentConfig);

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
            {lastNedDokumentFeilet && (
                <AlertStripeFeilPreWrap>{lastNedDokumentFeilet}</AlertStripeFeilPreWrap>
            )}
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
