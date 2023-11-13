import React from 'react';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import LeggTilBarnSomSkalFødes from '../../Behandling/Førstegangsbehandling/LeggTilBarnSomSkalFødes';
import { Journalføringsårsak } from '../Felles/utils';

const kanLeggeTilBarnSomSkalFødes = (journalpostState: JournalføringStateRequest) => {
    const erNyBehandling =
        journalpostState.journalføringsaksjon == Journalføringsaksjon.OPPRETT_BEHANDLING;
    const erPapirsøknad = journalpostState.journalføringsårsak === Journalføringsårsak.PAPIRSØKNAD;
    return erNyBehandling && erPapirsøknad;
};

const BarnSomSkalFødes: React.FC<{
    journalpostState: JournalføringStateRequest;
}> = ({ journalpostState }) => {
    if (kanLeggeTilBarnSomSkalFødes(journalpostState)) {
        return (
            <LeggTilBarnSomSkalFødes
                barnSomSkalFødes={journalpostState.barnSomSkalFødes}
                oppdaterBarnSomSkalFødes={journalpostState.settBarnSomSkalFødes}
            />
        );
    }

    return <></>;
};

export default BarnSomSkalFødes;
