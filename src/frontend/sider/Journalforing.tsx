import React, { useState } from 'react';
import { useParams } from 'react-router';
import { IJournalpost } from '../komponenter/Journalforing/journalforing';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import DataFetcher from '../komponenter/Felleskomponenter/DataFetcher/DataFetcher';
import { AxiosRequestConfig } from 'axios';
import Brukerinfo from '../komponenter/Journalforing/Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from '../komponenter/Journalforing/Dokumentvisning';
import { useApp } from '../context/AppContext';

const SideLayout = styled.div`
    margin: 0 2rem;
`;

const VensteKolonne = styled.div`
    width: 50%;
    float: left;
`;

const HoyreKolonne = styled.div`
    width: 50%;
    float: right;
`;

export const Journalforing: React.FC = () => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const { journalpostId } = useParams<{ journalpostId: string }>();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const config: AxiosRequestConfig = {
        method: 'GET',
        url: `/familie-ef-sak/api/journalpost/${journalpostId}`,
    };

    const hentDokument = (dokumentInfoId: string) => {
        axiosRequest<string, null>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}/dokument/${dokumentInfoId}`,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<string>) => settValgtDokument(res));
    };

    return (
        <DataFetcher config={config}>
            {(data: IJournalpost) => (
                <SideLayout>
                    <Sidetittel>Manuell Journalføring</Sidetittel>
                    <VensteKolonne>
                        <Brukerinfo bruker={data.bruker} />
                        <DokumentVisning journalPost={data} hentDokument={hentDokument} />
                    </VensteKolonne>
                    <HoyreKolonne>
                        <PdfVisning pdfFilInnhold={valgtDokument} />
                    </HoyreKolonne>
                </SideLayout>
            )}
        </DataFetcher>
    );
};
