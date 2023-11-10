import React from 'react';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import LeggTilBarnSomSkalFødes from '../../Behandling/Førstegangsbehandling/LeggTilBarnSomSkalFødes';
import { Journalføringsårsak } from '../Felles/utils';

const BarnSomSkalFødes: React.FC<{
    journalpostState: JournalføringStateRequest;
}> = ({ journalpostState }) => {
    return (
        kanLeggeTilBarnSomSkalFødes(journalpostState) && (
            <LeggTilBarnSomSkalFødes
                barnSomSkalFødes={journalpostState.barnSomSkalFødes}
                oppdaterBarnSomSkalFødes={journalpostState.settBarnSomSkalFødes}
            />
        )
    );
};

const kanLeggeTilBarnSomSkalFødes = (journalpostState: JournalføringStateRequest) => {
    const erNyBehandling =
        journalpostState.journalføringsaksjon == Journalføringsaksjon.OPPRETT_BEHANDLING;
    const erPapirsøknad = journalpostState.journalføringsårsak === Journalføringsårsak.PAPIRSØKNAD;
    return erNyBehandling && erPapirsøknad;
};

export default BarnSomSkalFødes;
