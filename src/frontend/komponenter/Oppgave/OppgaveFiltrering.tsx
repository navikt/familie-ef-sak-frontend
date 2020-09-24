import React, { useState } from 'react';
import { Datovelger } from 'nav-datovelger';

type Oppgavetype =
    | 'BehandleSak'
    | 'Journalføring'
    | 'GodkjenneVedtak'
    | 'BehandleUnderkjentVedtak'
    | 'Fordeling'
    | 'BehandleReturpost'
    | 'BehandleSED'
    | 'BehandleUderkjentVedtak'
    | 'FordelingSED'
    | 'Fremlegg'
    | 'Generell'
    | 'InnhentDokumentasjon'
    | 'JournalføringUtgående'
    | 'KontaktBruker'
    | 'KontrollerUtgåendeSkannetDokument'
    | 'SvarIkkeMottatt'
    | 'VurderDokument'
    | 'VurderHenvendelse'
    | 'VurderKonsekvensForYtelse'
    | 'VurderSvar';

type Behandlingstema =
    | 'Barnetrygd'
    | 'BarnetrygdEØS'
    | 'OrdinærBarnetrygd'
    | 'UtvidetBarnetrygd'
    | 'Skolepenger'
    | 'Barnetilsyn'
    | 'Overgangsstønad';

interface OppgaveRequest {
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    enhet?: string;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettet?: string;
    frist?: Date;
}

const initOppgaveRequest = {} as OppgaveRequest;

const OppgaveFiltering: React.FC = () => {
    const [oppgaveRequest, setOppgaveRequest] = useState<OppgaveRequest>(initOppgaveRequest);

    return (
        <Datovelger
            onChange={(dato) =>
                setOppgaveRequest((prevState: OppgaveRequest) => ({
                    ...prevState,
                    opprettet: dato,
                }))
            }
            valgtDato={oppgaveRequest.opprettet}
        />
    );
};

export default OppgaveFiltering;
