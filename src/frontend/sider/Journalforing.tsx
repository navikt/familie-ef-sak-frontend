import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { IJournalpost } from '../typer/journalforing';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../komponenter/Journalforing/PdfVisning';
import Behandling from '../komponenter/Journalforing/Behandling';
import { AxiosRequestConfig } from 'axios';
import Brukerinfo from '../komponenter/Journalforing/Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from '../komponenter/Journalforing/Dokumentvisning';
import { useApp } from '../context/AppContext';
import { behandlingstemaTilTekst } from '../typer/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import { BehandlingType } from '../typer/behandlingtype';
import { useGetQueryParams } from '../hooks/useGetQueryParams';
import DataViewer from '../komponenter/Felleskomponenter/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { SkjemaGruppe } from 'nav-frontend-skjema';

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

export interface BehandlingRequest {
    behandlingsId?: string;
    behandlingType?: BehandlingType;
}

interface JournalføringRequest {
    dokumentTitler?: Record<string, string>;
    fagsakId: string;
    oppgaveId: string;
    behandling?: BehandlingRequest;
}

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

export const Journalforing: React.FC = () => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const history = useHistory();

    const oppgaveIdParam = useGetQueryParams(OPPGAVEID_QUERY_STRING);
    const journalpostId = useGetQueryParams(JOURNALPOST_QUERY_STRING);

    const [oppgaveId] = useState<string>(oppgaveIdParam || '');
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<Record<string, string>>();
    const [journalpost, settJournalpost] = useState<Ressurs<IJournalpost>>(byggTomRessurs());
    const [forsøktJournalført, settForsøktJournalført] = useState<boolean>(false);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());

    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const hentJournalpostConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${journalpostId}`,
        }),
        [journalpostId]
    );

    const hentData = useCallback(() => {
        settJournalpost({ status: RessursStatus.HENTER });
        axiosRequest<IJournalpost, null>(
            hentJournalpostConfig,
            innloggetSaksbehandler
        ).then((res: Ressurs<IJournalpost>) => settJournalpost(res));
    }, [hentJournalpostConfig]);

    useEffect(() => {
        if (oppgaveId && journalpostId) {
            hentData();
        }
    }, [oppgaveId, journalpostId]);

    useEffect(() => {
        if (innsending.status === RessursStatus.SUKSESS) {
            history.push('/oppgavebenk');
        }
    }, [innsending]);

    if (!oppgaveIdParam || !journalpostId) {
        return <Redirect to="/oppgavebenk" />;
    }
    const hentDokument = (dokumentInfoId: string) => {
        axiosRequest<string, null>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}/dokument/${dokumentInfoId}`,
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<string>) => settValgtDokument(res));
    };

    const fullførJournalføring = () => {
        settForsøktJournalført(true);
        if (!behandling || innsending.status === RessursStatus.HENTER) {
            return;
        }
        settInnsending(byggHenterRessurs());
        const data: JournalføringRequest = {
            oppgaveId,
            fagsakId,
            behandling,
            dokumentTitler,
        };
        console.log('data:', data);
        axiosRequest<string, JournalføringRequest>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/journalpost/${journalpostId}/`,
                data,
            },
            innloggetSaksbehandler
        ).then((response: Ressurs<string>) => {
            settInnsending(response);
        });
    };

    return (
        <DataViewer response={journalpost}>
            {(data: IJournalpost) => (
                <SideLayout>
                    <Sidetittel>{`Registrere journalpost: ${
                        data.behandlingstema ? behandlingstemaTilTekst[data.behandlingstema] : ''
                    }`}</Sidetittel>
                    <Kolonner>
                        <div>
                            <Brukerinfo bruker={data.bruker} />
                            <DokumentVisning
                                journalPost={data}
                                hentDokument={hentDokument}
                                dokumentTitler={dokumentTitler}
                                settDokumentTitler={settDokumentTitler}
                            />
                            <SkjemaGruppe
                                feil={
                                    forsøktJournalført &&
                                    !behandling &&
                                    'Du må velge en behandling for å journalføre'
                                }
                            >
                                <Behandling
                                    settBehandling={settBehandling}
                                    behandling={behandling}
                                    personIdent={data.bruker.id}
                                    behandlingstema={data.behandlingstema}
                                    settFagsakId={settFagsakId}
                                />
                            </SkjemaGruppe>
                            {innsending.status === RessursStatus.FEILET && (
                                <AlertStripeFeil>{innsending.frontendFeilmelding}</AlertStripeFeil>
                            )}
                            <FlexKnapper>
                                <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                                <Hovedknapp
                                    onClick={fullførJournalføring}
                                    spinner={innsending.status === RessursStatus.HENTER}
                                >
                                    Journalfør
                                </Hovedknapp>
                            </FlexKnapper>
                        </div>
                        <div>
                            <PdfVisning pdfFilInnhold={valgtDokument} />
                        </div>
                    </Kolonner>
                </SideLayout>
            )}
        </DataViewer>
    );
};
