import constate from 'constate';
import { useState } from 'react';

const [OppgaveRequestProvider, useOppgaveRequestProvider] = constate(() => {
    const [behandlingstema, setBehandlingstema] = useState(null); //Behandlingstema
    const [oppgavetype, setOppgavetype] = useState(null); //Oppgavetype
    const [enhet, setEnhet] = useState(null); //string
    const [saksbehandler, setSaksbehandler] = useState(null); //string
    const [journalpostId, setJournalpostId] = useState(null); //string
    const [tilordnetRessurs, setTilordnetRessurs] = useState(null); // string
    const [tildeltRessurs, setTildeltRessurs] = useState(null); // boolean
    const [opprettetFomTidspunkt, setOpprettetFomTidspunkt] = useState(null); // LocalDateTime
    const [opprettetTomTidspunkt, setOpprettetTomTidspunkt] = useState(null); // LocalDateTime
    const [fristFomDato, setFristFomDato] = useState(null); // LocalDate
    const [fristTomDato, setFristTomDato] = useState(null); // LocalDate
    const [aktivFomDato, setAktivFomDato] = useState(null); // LocalDate
    const [limit, setLimit] = useState(150); // number
    const [offset, setOffset] = useState(0); // number
    return {
        behandlingstema,
        setBehandlingstema,
        oppgavetype,
        setOppgavetype,
        enhet,
        setEnhet,
        saksbehandler,
        setSaksbehandler,
        journalpostId,
        setJournalpostId,
        tilordnetRessurs,
        setTilordnetRessurs,
        tildeltRessurs,
        setTildeltRessurs,
        opprettetFomTidspunkt,
        setOpprettetFomTidspunkt,
        opprettetTomTidspunkt,
        setOpprettetTomTidspunkt,
        fristFomDato,
        setFristFomDato,
        fristTomDato,
        setFristTomDato,
        aktivFomDato,
        setAktivFomDato,
        limit,
        setLimit,
        offset,
        setOffset,
    };
});

export { OppgaveRequestProvider, useOppgaveRequestProvider };
