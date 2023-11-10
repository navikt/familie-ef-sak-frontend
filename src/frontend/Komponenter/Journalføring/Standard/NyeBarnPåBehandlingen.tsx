import React from 'react';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { Journalføringsårsak } from '../Felles/utils';
import { Fagsak } from '../../../App/typer/fagsak';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import EttersendingMedNyeBarn from './EttersendingMedNyeBarn';

const NyeBarnPåBehandlingen: React.FC<{
    journalpostState: JournalføringStateRequest;
    fagsak: Ressurs<Fagsak>;
}> = ({ journalpostState, fagsak }) => {
    const erEttersending =
        journalpostState.journalføringsårsak === Journalføringsårsak.ETTERSENDING;
    const harHentetFagsak = fagsak.status === RessursStatus.SUKSESS;
    const skalOppretteNyBehandling =
        journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING;

    return (
        skalOppretteNyBehandling &&
        erEttersending &&
        harHentetFagsak && (
            <EttersendingMedNyeBarn
                fagsak={fagsak.data}
                vilkårsbehandleNyeBarn={journalpostState.vilkårsbehandleNyeBarn}
                settVilkårsbehandleNyeBarn={journalpostState.settVilkårsbehandleNyeBarn}
            />
        )
    );
};

export default NyeBarnPåBehandlingen;
