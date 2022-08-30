import { Dispatch, SetStateAction, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandlingstype } from '../typer/behandlingstype';
import { UstrukturertDokumentasjonType } from '../../Komponenter/Journalforing/VelgUstrukturertDokumentasjonType';
import { EVilkårsbehandleBarnValg } from '../typer/vilkårsbehandleBarnValg';

export interface BehandlingRequest {
    behandlingsId?: string;
    behandlingstype?: Behandlingstype;
    ustrukturertDokumentasjonType?: UstrukturertDokumentasjonType;
}

interface JournalføringRequest {
    dokumentTitler?: Record<string, string>;
    fagsakId: string;
    oppgaveId: string;
    behandling?: BehandlingRequest;
    journalførendeEnhet: string;
    navIdent?: string;
    barnSomSkalFødes: BarnSomSkalFødes[];
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
}

export interface BarnSomSkalFødes {
    _id: string; // brukes kun i frontend for å oppdatere å rendere barn
    fødselTerminDato?: string;
}

export interface JournalføringStateRequest {
    oppgaveId: string;
    settOppgaveId: Dispatch<SetStateAction<string>>;
    fagsakId: string;
    settFagsakId: Dispatch<SetStateAction<string>>;
    behandling?: BehandlingRequest;
    settBehandling: Dispatch<SetStateAction<BehandlingRequest | undefined>>;
    dokumentTitler?: Record<string, string>;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
    forsøktJournalført: boolean;
    settForsøktJournalført: Dispatch<SetStateAction<boolean>>;
    innsending: Ressurs<string>;
    settInnsending: Dispatch<SetStateAction<Ressurs<string>>>;
    fullførJournalføring: (
        journalpostId: string,
        journalførendeEnhet: string,
        navIdent?: string
    ) => void;
    visBekreftelsesModal: boolean;
    settVisBekreftelsesModal: Dispatch<SetStateAction<boolean>>;
    visJournalføringIkkeMuligModal: boolean;
    settJournalføringIkkeMuligModal: Dispatch<SetStateAction<boolean>>;
    barnSomSkalFødes: BarnSomSkalFødes[];
    settBarnSomSkalFødes: Dispatch<SetStateAction<BarnSomSkalFødes[]>>;
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined;
    settUstrukturertDokumentasjonType: Dispatch<SetStateAction<UstrukturertDokumentasjonType>>;
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
    settVilkårsbehandleNyeBarn: Dispatch<SetStateAction<EVilkårsbehandleBarnValg>>;
}

export const useJournalføringState = (): JournalføringStateRequest => {
    const { axiosRequest } = useApp();
    const [oppgaveId, settOppgaveId] = useState<string>('');
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<Record<string, string>>();
    const [forsøktJournalført, settForsøktJournalført] = useState<boolean>(false);
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());
    const [visBekreftelsesModal, settVisBekreftelsesModal] = useState<boolean>(false);
    const [visJournalføringIkkeMuligModal, settJournalføringIkkeMuligModal] =
        useState<boolean>(false);
    const [barnSomSkalFødes, settBarnSomSkalFødes] = useState<BarnSomSkalFødes[]>([]);
    const [ustrukturertDokumentasjonType, settUstrukturertDokumentasjonType] =
        useState<UstrukturertDokumentasjonType>(UstrukturertDokumentasjonType.IKKE_VALGT);
    const [vilkårsbehandleNyeBarn, settVilkårsbehandleNyeBarn] = useState<EVilkårsbehandleBarnValg>(
        EVilkårsbehandleBarnValg.IKKE_VALGT
    );

    useEffect(() => {
        settBehandling(undefined);
    }, [fagsakId]);

    const fullførJournalføring = (
        journalpostId: string,
        journalførendeEnhet: string,
        navIdent?: string
    ) => {
        settForsøktJournalført(true);
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
            journalførendeEnhet,
            navIdent,
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
        oppgaveId,
        settOppgaveId,
        fagsakId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
        forsøktJournalført,
        settForsøktJournalført,
        innsending,
        settInnsending,
        fullførJournalføring,
        visBekreftelsesModal,
        settVisBekreftelsesModal,
        visJournalføringIkkeMuligModal,
        settJournalføringIkkeMuligModal,
        barnSomSkalFødes,
        settBarnSomSkalFødes,
        ustrukturertDokumentasjonType,
        settUstrukturertDokumentasjonType,
        vilkårsbehandleNyeBarn,
        settVilkårsbehandleNyeBarn,
    };
};
