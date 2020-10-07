import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useParams } from 'react-router';
import { IJournalpost } from '../komponenter/Journalforing/journalforing';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import SystemetLaster from '../komponenter/Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Normaltekst, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Rediger from '../ikoner/Rediger';
import VisPdf from '../ikoner/VisPdf';
import { OrNothing } from '../hooks/useSorteringState';

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
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>({
        status: RessursStatus.IKKE_HENTET,
    });
    const [dokumentForRedigering, settDokumentForRedigering] = useState<OrNothing<string>>();
    const { journalpostId } = useParams<{ journalpostId: string }>();
    const [journalpost, settJournalpost] = useState<Ressurs<IJournalpost>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const hentJournalPost = useCallback(() => {
        settJournalpost({ status: RessursStatus.HENTER });
        axiosRequest<IJournalpost, null>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}`,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<IJournalpost>) => settJournalpost(res));
    }, [journalpostId]);

    const hentDokument = (dokumentInfoId: string) => {
        axiosRequest<string, null>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}/dokument/${dokumentInfoId}`,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<string>) => settValgtDokument(res));
    };

    useEffect(() => {
        hentJournalPost();
    }, [hentJournalPost]);

    if (journalpost.status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (journalpost.status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (journalpost.status === RessursStatus.FEILET) {
        return <AlertStripeFeil children="Noe gikk galt" />;
    } else if (journalpost.status === RessursStatus.IKKE_HENTET) {
        return null;
    }

    const { bruker, dokumenter } = journalpost.data;

    return (
        <SideLayout>
            <Sidetittel>Manuell Journalføring</Sidetittel>
            <VensteKolonne>
                <Systemtittel>Bruker</Systemtittel>
                <Normaltekst>{bruker.id}</Normaltekst>

                <ul>
                    {dokumenter.map((dokument) => (
                        <li key={dokument.dokumentInfoId}>
                            {dokument.tittel}
                            <span>
                                <Knapp
                                    kompakt={true}
                                    onClick={() =>
                                        settDokumentForRedigering(dokument.dokumentInfoId)
                                    }
                                >
                                    <Rediger />
                                </Knapp>
                                <Knapp
                                    kompakt={true}
                                    onClick={() => hentDokument(dokument.dokumentInfoId)}
                                >
                                    <VisPdf />
                                </Knapp>
                            </span>

                            {dokumentForRedigering === dokument.dokumentInfoId && (
                                <div>
                                    <input type={'text'} />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </VensteKolonne>
            <HoyreKolonne>
                <PdfVisning pdfFilInnhold={valgtDokument} />
            </HoyreKolonne>
        </SideLayout>
    );
};
