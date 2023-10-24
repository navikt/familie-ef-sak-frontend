import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandlingstype } from '../typer/behandlingstype';
import { UstrukturertDokumentasjonType } from '../../Komponenter/Journalføring/Standard/VelgUstrukturertDokumentasjonType';
import { EVilkårsbehandleBarnValg } from '../typer/vilkårsbehandleBarnValg';
import {
    LogiskeVedleggPåDokument,
    DokumentTitler,
    IJournalpostResponse,
    DokumentInfo,
} from '../typer/journalføring';
import { Journalføringsårsak } from '../../Komponenter/Journalføring/Felles/utils';
import { behandlingstemaTilStønadstype, Stønadstype } from '../typer/behandlingstema';
import { HentDokumentResponse, useHentDokument } from './useHentDokument';
import { useHentFagsak } from './useHentFagsak';
import { Fagsak } from '../typer/fagsak';

export interface BehandlingRequest {
    behandlingsId?: string;
    behandlingstype?: Behandlingstype;
    ustrukturertDokumentasjonType?: UstrukturertDokumentasjonType;
}

interface JournalføringRequest {
    dokumentTitler?: DokumentTitler;
    fagsakId: string;
    oppgaveId: string;
    behandling?: BehandlingRequest;
    journalførendeEnhet: string;
    barnSomSkalFødes: BarnSomSkalFødes[];
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
}

export interface BarnSomSkalFødes {
    _id: string; // brukes kun i frontend for å oppdatere å rendere barn
    fødselTerminDato?: string;
}

export interface JournalføringStateRequest {
    fagsak: Ressurs<Fagsak>;
    fagsakId: string;
    settFagsakId: Dispatch<SetStateAction<string>>;
    behandling?: BehandlingRequest;
    settBehandling: Dispatch<SetStateAction<BehandlingRequest | undefined>>;
    dokumentTitler?: DokumentTitler;
    settDokumentTitler: Dispatch<SetStateAction<DokumentTitler | undefined>>;
    logiskeVedleggPåDokument?: LogiskeVedleggPåDokument;
    settLogiskeVedleggPåDokument: Dispatch<SetStateAction<LogiskeVedleggPåDokument | undefined>>;
    innsending: Ressurs<string>;
    settInnsending: Dispatch<SetStateAction<Ressurs<string>>>;
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
    skalOppretteNyBehandling: boolean;
    settSkalOppretteNyBehandling: Dispatch<SetStateAction<boolean>>;
    nyAvsender: string;
    settNyAvsender: Dispatch<SetStateAction<string>>;
}

export const useJournalføringState = (
    journalResponse: IJournalpostResponse,
    oppgaveId: string
): JournalføringStateRequest => {
    const utledJournalføringsårsak = () => {
        if (journalResponse.harStrukturertSøknad) {
            return Journalføringsårsak.DIGITAL_SØKNAD;
        } else if (journalResponse.journalpost.tittel.includes('Ettersending')) {
            return Journalføringsårsak.ETTERSENDING;
        } else {
            return Journalføringsårsak.IKKE_VALGT;
        }
    };

    const utledFørsteDokument = (dokumenter: DokumentInfo[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const { fagsak, hentFagsak } = useHentFagsak();
    const hentDokumentResponse = useHentDokument(journalResponse.journalpost);

    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [logiskeVedleggPåDokument, settLogiskeVedleggPåDokument] =
        useState<LogiskeVedleggPåDokument>(); // TODO: Denne må sendes med til backend for å bli satt
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
        behandlingstemaTilStønadstype(journalResponse.journalpost.behandlingstema)
    );
    const [valgtDokumentPanel, settValgtDokumentPanel] = useState<string>(
        utledFørsteDokument(journalResponse.journalpost.dokumenter)
    );
    const [skalOppretteNyBehandling, settSkalOppretteNyBehandling] = useState<boolean>(false); // TODO: Denne må sendes med til backend for å bli utført
    const [nyAvsender, settNyAvsender] = useState<string>(''); // TODO: Denne må sendes med til backend for å bli satt

    useEffect(() => {
        if (stønadstype) {
            hentFagsak(journalResponse.personIdent, stønadstype);
        }
    }, [journalResponse.personIdent, stønadstype, hentFagsak]);

    useEffect(() => {
        settBehandling(undefined);
    }, [fagsakId]);

    const fullførJournalføring = () => {
        if (!behandling || innsending.status === RessursStatus.HENTER) {
            return;
        }

        const nyBehandling: BehandlingRequest = {
            ...behandling,
            ustrukturertDokumentasjonType,
        };

        const data: JournalføringRequest = {
            oppgaveId,
            fagsakId,
            behandling: nyBehandling,
            dokumentTitler,
            journalførendeEnhet: innloggetSaksbehandler.enhet || '9999',
            barnSomSkalFødes,
            vilkårsbehandleNyeBarn,
        };
        settInnsending(byggHenterRessurs());
        axiosRequest<string, JournalføringRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/journalpost/${journalResponse.journalpost.journalpostId}/fullfor`,
            data,
        }).then((resp) => settInnsending(resp));
    };

    return {
        fagsak,
        fagsakId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
        logiskeVedleggPåDokument,
        settLogiskeVedleggPåDokument,
        innsending,
        settInnsending,
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
        skalOppretteNyBehandling,
        settSkalOppretteNyBehandling,
        nyAvsender,
        settNyAvsender,
    };
};
