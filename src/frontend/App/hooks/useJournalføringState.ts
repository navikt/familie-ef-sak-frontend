import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandlingstype } from '../typer/behandlingstype';
import { UstrukturertDokumentasjonType } from '../../Komponenter/Journalføring/VelgUstrukturertDokumentasjonType';
import { EVilkårsbehandleBarnValg } from '../typer/vilkårsbehandleBarnValg';
import { DokumentTitler } from '../typer/journalføring';

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
    navIdent?: string;
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
    innsending: Ressurs<string>;
    settInnsending: Dispatch<SetStateAction<Ressurs<string>>>;
    fullførJournalføring: (journalførendeEnhet: string, navIdent?: string) => void;
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

export const useJournalføringState = (
    oppgaveId: string,
    journalpostId: string
): JournalføringStateRequest => {
    const { axiosRequest } = useApp();
    const [fagsakId, settFagsakId] = useState<string>('');
    const [behandling, settBehandling] = useState<BehandlingRequest>();
    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
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

    const fullførJournalføring = (journalførendeEnhet: string, navIdent?: string) => {
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
        fagsakId,
        settFagsakId,
        behandling,
        settBehandling,
        dokumentTitler,
        settDokumentTitler,
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
