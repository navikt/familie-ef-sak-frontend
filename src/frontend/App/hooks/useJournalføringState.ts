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
    UstrukturertDokumentasjonType,
} from '../../Komponenter/Journalføring/Standard/utils';
import { behandlingstemaTilStønadstype, Stønadstype } from '../typer/behandlingstema';
import { HentDokumentResponse, useHentDokument } from './useHentDokument';
import { useHentFagsak } from './useHentFagsak';
import { Fagsak } from '../typer/fagsak';

export enum Journalføringsaksjon {
    OPPRETT_BEHANDLING = 'OPPRETT_BEHANDLING',
    JOURNALFØR_PÅ_FAGSAK = 'JOURNALFØR_PÅ_FAGSAK',
}

interface JournalføringRequest {
    fagsakId: string;
    oppgaveId: string;
    avsender: NyAvsender | undefined;
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
    fullførJournalføring: () => void;
    visBekreftelsesModal: boolean;
    settVisBekreftelsesModal: Dispatch<SetStateAction<boolean>>;
    barnSomSkalFødes: BarnSomSkalFødes[];
    settBarnSomSkalFødes: Dispatch<SetStateAction<BarnSomSkalFødes[]>>;
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined;
    settUstrukturertDokumentasjonType: Dispatch<SetStateAction<UstrukturertDokumentasjonType>>;
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
    oppgaveId: string
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
        } else if (journalpost.tittel.includes('Ettersending')) {
            return Journalføringsårsak.ETTERSENDING;
        } else {
            return Journalføringsårsak.IKKE_VALGT;
        }
    };

    const utledFørsteDokument = (dokumenter: DokumentInfo[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const { fagsak, hentFagsak } = useHentFagsak();
    const hentDokumentResponse = useHentDokument(journalpost);

    const [fagsakId, settFagsakId] = useState<string>('');
    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [logiskeVedleggPåDokument, settLogiskeVedleggPåDokument] =
        useState<LogiskeVedleggPåDokument>(initielleLogiskeVedlegg);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());
    const [visBekreftelsesModal, settVisBekreftelsesModal] = useState<boolean>(false);
    const [barnSomSkalFødes, settBarnSomSkalFødes] = useState<BarnSomSkalFødes[]>([]);
    const [ustrukturertDokumentasjonType, settUstrukturertDokumentasjonType] =
        useState<UstrukturertDokumentasjonType>(UstrukturertDokumentasjonType.IKKE_VALGT);
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

    const fullførJournalføring = () => {
        if (innsending.status === RessursStatus.HENTER) {
            return;
        }

        const request: JournalføringRequest = {
            fagsakId: fagsakId,
            oppgaveId: oppgaveId,
            avsender: nyAvsender,
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
        axiosRequest<string, JournalføringRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/journalpost/${journalpost.journalpostId}/fullfor/v2`,
            data: request,
        }).then((res) => settInnsending(res));
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
        fullførJournalføring,
        visBekreftelsesModal,
        settVisBekreftelsesModal,
        barnSomSkalFødes,
        settBarnSomSkalFødes,
        ustrukturertDokumentasjonType,
        settUstrukturertDokumentasjonType,
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
