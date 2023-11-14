import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import React from 'react';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { journalføringGjelderKlage } from './utils';

export const KlageMottatt: React.FC<{
    journalpostState: JournalføringStateRequest;
    journalResponse: IJournalpostResponse;
}> = ({ journalpostState, journalResponse }) => {
    const skalViseDatoMottatt =
        journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING &&
        journalføringGjelderKlage(journalpostState.journalføringsårsak);
    const journalpostenHarMottattDato = !!journalResponse.journalpost.datoMottatt;

    return skalViseDatoMottatt ? (
        <Datovelger
            id={'datoMottatt'}
            label={'Klage mottatt'}
            settVerdi={journalpostState.settMottattDato}
            verdi={journalpostState.mottattDato}
            erLesevisning={journalpostenHarMottattDato}
        />
    ) : (
        <></>
    );
};
