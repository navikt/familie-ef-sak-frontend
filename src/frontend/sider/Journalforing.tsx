import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useParams } from 'react-router';
import { IJournalpost } from '../komponenter/Journalforing/journalforing';
import { Ressurs, RessursStatus, RessursSuksess } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import SystemetLaster from '../komponenter/Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const VensteKolonn = styled.div`
    width: 70%;
    float: left;
`;

const HoyreKolonn = styled.div`
    width: 30%;
    float: right;
`;

export const Journalforing: React.FC = () => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const { journalpostId } = useParams<{ journalpostId: string }>();
    const [journalpost, settJournalpost] = useState<Ressurs<IJournalpost>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const hentJournalPost = (journalpostId: string) => {
        settJournalpost({ status: RessursStatus.HENTER });
        axiosRequest<IJournalpost, null>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}`,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<IJournalpost>) => settJournalpost(res));
    };

    useEffect(() => {
        hentJournalPost(journalpostId);
    }, [journalpost]);

    if (journalpost.status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (journalpost.status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (journalpost.status === RessursStatus.FEILET) {
        return <AlertStripeFeil children="Noe gikk galt" />;
    } else if (journalpost.status === RessursStatus.IKKE_HENTET) {
        return null;
    }

    const data = journalpost as RessursSuksess<IJournalpost>;

    return (
        <div>
            <VensteKolonn>journalinfo</VensteKolonn>
            <HoyreKolonn>
                <PdfVisning />
            </HoyreKolonn>
        </div>
    );
};
