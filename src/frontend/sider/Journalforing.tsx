import React, { useMemo, useState } from 'react';
import { IJournalpost } from '../typer/journalforing';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import Behandling from '../komponenter/Journalforing/Behandling';
import DataFetcher from '../komponenter/Felleskomponenter/DataFetcher/DataFetcher';
import { AxiosRequestConfig } from 'axios';
import Brukerinfo from '../komponenter/Journalforing/Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from '../komponenter/Journalforing/Dokumentvisning';
import { useApp } from '../context/AppContext';
import { behandlingstemaTilTekst } from '../komponenter/Oppgavebenk/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';

const SideLayout = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: 2rem;
`;

const Kolonner = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const Journalforing: React.FC = () => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const { journalpostId } = useParams<{ journalpostId: string }>();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const config: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${journalpostId}`,
        }),
        [journalpostId]
    );

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
                    <Sidetittel>{`Registrere journalpost: ${
                        data.behandlingstema ? behandlingstemaTilTekst[data.behandlingstema] : ''
                    }`}</Sidetittel>
                    <Kolonner>
                        <div>
                            <Brukerinfo bruker={data.bruker} />
                            <DokumentVisning journalPost={data} hentDokument={hentDokument} />
                            <Behandling
                                personIdent={data.bruker.id}
                                behandlingstema={data.behandlingstema}
                            />
                            <FlexKnapper>
                                <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                                <Hovedknapp>Journalfør</Hovedknapp>
                            </FlexKnapper>
                        </div>
                        <div>
                            <PdfVisning pdfFilInnhold={valgtDokument} />
                        </div>
                    </Kolonner>
                </SideLayout>
            )}
        </DataFetcher>
    );
};
