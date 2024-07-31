import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { EVilkårsbehandleBarnValg } from '../typer/vilkårsbehandleBarnValg';
import {
    DokumentInfo,
    DokumentTitler,
    IJournalpostResponse,
    LogiskeVedleggPåDokument,
} from '../typer/journalføring';
import {
    Journalføringsårsak,
    utledJournalføringEvent,
} from '../../Komponenter/Journalføring/Felles/utils';
import { behandlingstemaTilStønadstype, Stønadstype } from '../typer/behandlingstema';
import { HentDokumentResponse, useHentDokument } from './useHentDokument';
import { useHentFagsak } from './useHentFagsak';
import { Fagsak } from '../typer/fagsak';
import { loggJournalføring } from '../utils/amplitude/amplitudeLoggEvents';

export enum Journalføringsaksjon {
    OPPRETT_BEHANDLING = 'OPPRETT_BEHANDLING',
    JOURNALFØR_PÅ_FAGSAK = 'JOURNALFØR_PÅ_FAGSAK',
}

export interface JournalføringRequestV2 {
    fagsakId: string;
    oppgaveId: string;
    nyAvsender: NyAvsender | undefined;
    dokumentTitler: DokumentTitler | undefined;
    logiskeVedlegg: LogiskeVedleggPåDokument | undefined;
    journalførendeEnhet: string;
    årsak: Journalføringsårsak;
    aksjon: Journalføringsaksjon;
    mottattDato: string | undefined;
    barnSomSkalFødes: BarnSomSkalFødes[];
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
}

interface NyAvsender {
    erBruker: boolean;
    navn?: string;
    personIdent?: string;
}

export interface BarnSomSkalFødes {
    _id: string; // brukes kun i frontend for å oppdatere og rendere barn
    fødselTerminDato?: string;
}

export interface JournalføringStateRequest {
    fagsak: Ressurs<Fagsak>;
    fagsakId: string;
    settFagsakId: Dispatch<SetStateAction<string>>;
    dokumentTitler?: DokumentTitler;
    settDokumentTitler: Dispatch<SetStateAction<DokumentTitler | undefined>>;
    logiskeVedleggPåDokument?: LogiskeVedleggPåDokument;
    settLogiskeVedleggPåDokument: Dispatch<SetStateAction<LogiskeVedleggPåDokument>>;
    innsending: Ressurs<string>;
    fullførJournalføringV2: () => void;
    visBekreftelsesModal: boolean;
    settVisBekreftelsesModal: Dispatch<SetStateAction<boolean>>;
    barnSomSkalFødes: BarnSomSkalFødes[];
    settBarnSomSkalFødes: Dispatch<SetStateAction<BarnSomSkalFødes[]>>;
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
    settVilkårsbehandleNyeBarn: Dispatch<SetStateAction<EVilkårsbehandleBarnValg>>;
    journalføringsårsak: Journalføringsårsak;
    settJournalføringsårsak: Dispatch<SetStateAction<Journalføringsårsak>>;
    stønadstype: Stønadstype | undefined;
    settStønadstype: Dispatch<SetStateAction<Stønadstype | undefined>>;
    valgtDokumentPanel: string;
    settValgtDokumentPanel: Dispatch<SetStateAction<string>>;
    hentDokumentResponse: HentDokumentResponse;
    nyAvsender: NyAvsender | undefined;
    settNyAvsender: Dispatch<SetStateAction<NyAvsender | undefined>>;
    journalføringsaksjon: Journalføringsaksjon;
    settJournalføringsaksjon: Dispatch<SetStateAction<Journalføringsaksjon>>;
    mottattDato: string | undefined;
    settMottattDato: Dispatch<SetStateAction<string | undefined>>;
}

export const useJournalføringState = (
    journalResponse: IJournalpostResponse,
    oppgaveId: string,
    gjelderKlage?: boolean
): JournalføringStateRequest => {
    const { harStrukturertSøknad, journalpost, personIdent } = journalResponse;

    const initielleLogiskeVedlegg = journalResponse.journalpost.dokumenter.reduce(
        (acc, { dokumentInfoId, logiskeVedlegg }) => ({
            ...acc,
            [dokumentInfoId]: logiskeVedlegg,
        }),
        {} as LogiskeVedleggPåDokument
    );

    const utledJournalføringsårsak = () => {
        if (harStrukturertSøknad) {
            return Journalføringsårsak.DIGITAL_SØKNAD;
        } else if (journalpost.tittel && journalpost.tittel.includes('Ettersending')) {
            return Journalføringsårsak.ETTERSENDING;
        } else if (gjelderKlage) {
            return Journalføringsårsak.KLAGE;
        } else {
            return Journalføringsårsak.IKKE_VALGT;
        }
    };

    const utledFørsteDokument = (dokumenter: DokumentInfo[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const { fagsakPåPersonIdent: fagsak, hentFagsakPåPersonIdent: hentFagsak } = useHentFagsak();
    const hentDokumentResponse = useHentDokument(journalpost);

    const [fagsakId, settFagsakId] = useState<string>('');
    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [logiskeVedleggPåDokument, settLogiskeVedleggPåDokument] =
        useState<LogiskeVedleggPåDokument>(initielleLogiskeVedlegg);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());
    const [visBekreftelsesModal, settVisBekreftelsesModal] = useState<boolean>(false);
    const [barnSomSkalFødes, settBarnSomSkalFødes] = useState<BarnSomSkalFødes[]>([]);
    const [vilkårsbehandleNyeBarn, settVilkårsbehandleNyeBarn] = useState<EVilkårsbehandleBarnValg>(
        EVilkårsbehandleBarnValg.IKKE_VALGT
    );
    const [journalføringsårsak, settJournalføringsårsak] = useState<Journalføringsårsak>(
        utledJournalføringsårsak()
    );
    const [stønadstype, settStønadstype] = useState<Stønadstype | undefined>(
        behandlingstemaTilStønadstype(journalpost.behandlingstema)
    );
    const [valgtDokumentPanel, settValgtDokumentPanel] = useState<string>(
        utledFørsteDokument(journalpost.dokumenter)
    );
    const [nyAvsender, settNyAvsender] = useState<NyAvsender>();
    const [journalføringsaksjon, settJournalføringsaksjon] = useState<Journalføringsaksjon>(
        Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
    );
    const [mottattDato, settMottattDato] = useState<string | undefined>(
        journalResponse.journalpost.datoMottatt
    );

    useEffect(() => {
        if (stønadstype) {
            hentFagsak(personIdent, stønadstype);
        }
    }, [personIdent, stønadstype, hentFagsak]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            settFagsakId(fagsak.data.id);
        }
    }, [fagsak]);

    const fullførJournalføringV2 = () => {
        if (innsending.status === RessursStatus.HENTER) {
            return;
        }

        const request: JournalføringRequestV2 = {
            fagsakId: fagsakId,
            oppgaveId: oppgaveId,
            nyAvsender: nyAvsender,
            dokumentTitler: dokumentTitler,
            logiskeVedlegg: logiskeVedleggPåDokument,
            journalførendeEnhet: innloggetSaksbehandler.enhet || '9999',
            årsak: journalføringsårsak,
            aksjon: journalføringsaksjon,
            mottattDato: mottattDato,
            barnSomSkalFødes: barnSomSkalFødes,
            vilkårsbehandleNyeBarn: vilkårsbehandleNyeBarn,
        };
        settInnsending(byggHenterRessurs());
        axiosRequest<string, JournalføringRequestV2>({
            method: 'POST',
            url: `/familie-ef-sak/api/journalpost/${journalpost.journalpostId}/fullfor/v2`,
            data: request,
        }).then((res) => {
            settInnsending(res);
            if (res.status === RessursStatus.SUKSESS) {
                loggJournalføring(utledJournalføringEvent(request, journalpost, stønadstype));
            }
        });
    };

    return {
        fagsak,
        fagsakId,
        settFagsakId,
        dokumentTitler,
        settDokumentTitler,
        logiskeVedleggPåDokument,
        settLogiskeVedleggPåDokument,
        innsending,
        fullførJournalføringV2,
        visBekreftelsesModal,
        settVisBekreftelsesModal,
        barnSomSkalFødes,
        settBarnSomSkalFødes,
        vilkårsbehandleNyeBarn,
        settVilkårsbehandleNyeBarn,
        journalføringsårsak,
        settJournalføringsårsak,
        stønadstype,
        settStønadstype,
        valgtDokumentPanel,
        settValgtDokumentPanel,
        hentDokumentResponse,
        nyAvsender,
        settNyAvsender,
        journalføringsaksjon,
        settJournalføringsaksjon,
        mottattDato,
        settMottattDato,
    };
};
