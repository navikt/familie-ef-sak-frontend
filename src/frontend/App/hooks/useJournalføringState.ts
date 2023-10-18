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
} from '../typer/journalføring';
import { Journalføringsårsak } from '../../Komponenter/Journalføring/Felles/utils';
import { behandlingstemaTilStønadstype, Stønadstype } from '../typer/behandlingstema';

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
}

export const useJournalføringState = (
    journalResponse: IJournalpostResponse,
    oppgaveId: string,
    journalpostId: string
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

    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [logiskeVedleggPåDokument, settLogiskeVedleggPåDokument] =
        useState<LogiskeVedleggPåDokument>();
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
            url: `/familie-ef-sak/api/journalpost/${journalpostId}/fullfor`,
            data,
        }).then((resp) => settInnsending(resp));
    };

    return {
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
    };
};
