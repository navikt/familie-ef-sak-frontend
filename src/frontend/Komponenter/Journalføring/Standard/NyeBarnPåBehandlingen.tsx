import React from 'react';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { Journalføringsårsak } from './utils';
import { RessursStatus } from '../../../App/typer/ressurs';
import EttersendingMedNyeBarn from './EttersendingMedNyeBarn';

const NyeBarnPåBehandlingen: React.FC<{
    journalpostState: JournalføringStateRequest;
}> = ({ journalpostState }) => {
    const {
        fagsak,
        journalføringsaksjon,
        journalføringsårsak,
        settVilkårsbehandleNyeBarn,
        vilkårsbehandleNyeBarn,
    } = journalpostState;

    const erEttersending = journalføringsårsak === Journalføringsårsak.ETTERSENDING;
    const harHentetFagsak = fagsak.status === RessursStatus.SUKSESS;
    const skalOppretteNyBehandling =
        journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING;

    return (
        skalOppretteNyBehandling &&
        erEttersending &&
        harHentetFagsak && (
            <EttersendingMedNyeBarn
                fagsak={fagsak.data}
                vilkårsbehandleNyeBarn={vilkårsbehandleNyeBarn}
                settVilkårsbehandleNyeBarn={settVilkårsbehandleNyeBarn}
            />
        )
    );
};

export default NyeBarnPåBehandlingen;
