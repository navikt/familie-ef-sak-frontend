import React, { useState } from 'react';
import { Datovelger } from 'nav-datovelger';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Oppgavetype, oppgaveTypeTilTekst } from './oppgave';
import { Behandlingstema, behandlingstemaTilTekst } from './behandlingstema';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

interface IOppgaveRequest {
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

interface IOppgaveFiltrering {
    hentOppgaver: any;
}

const initOppgaveRequest = {} as IOppgaveRequest;

const OppgaveFiltering: React.FC<IOppgaveFiltrering> = ({ hentOppgaver }) => {
    const [oppgaveRequest, setOppgaveRequest] = useState<IOppgaveRequest>(initOppgaveRequest);

    return (
        <StyledDiv>
            <Datovelger
                onChange={(dato) =>
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        opprettet: dato,
                    }))
                }
                valgtDato={oppgaveRequest.opprettet}
            />
            <Select
                label="Oppgavetype"
                onChange={(event) =>
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        oppgavetype: event.target.value as Oppgavetype,
                    }))
                }
            >
                {Object.entries(oppgaveTypeTilTekst).map(([val, tekst]) => (
                    <option value={val}>{tekst}</option>
                ))}
            </Select>
            <Select
                label="Behandlingstema"
                onChange={(event) =>
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        behandlingstema: event.target.value as Behandlingstema,
                    }))
                }
            >
                {Object.entries(behandlingstemaTilTekst).map(([val, tekst]) => (
                    <option value={val}>{tekst}</option>
                ))}
            </Select>
            <Knapp onClick={hentOppgaver}>Hent oppgaver</Knapp>
        </StyledDiv>
    );
};

export default OppgaveFiltering;
