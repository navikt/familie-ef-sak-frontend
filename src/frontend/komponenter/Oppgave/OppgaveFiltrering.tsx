import React, { useState } from 'react';
import { Datovelger } from 'nav-datovelger';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import { Oppgavetype, oppgaveTypeTilTekst } from './oppgave';
import { Behandlingstema, behandlingstemaTilTekst } from './behandlingstema';

const StyledDiv = styled.div`
    margin: 0 auto;
    max-width: 1920px;
    display: flex;
`;

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
        <StyledDiv>
            <Datovelger
                onChange={(dato) =>
                    setOppgaveRequest((prevState: OppgaveRequest) => ({
                        ...prevState,
                        opprettet: dato,
                    }))
                }
                valgtDato={oppgaveRequest.opprettet}
            />
            <Select
                label="Oppgavetype"
                onChange={(event) =>
                    setOppgaveRequest((prevState: OppgaveRequest) => ({
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
                    setOppgaveRequest((prevState: OppgaveRequest) => ({
                        ...prevState,
                        behandlingstema: event.target.value as Behandlingstema,
                    }))
                }
            >
                {Object.entries(behandlingstemaTilTekst).map(([val, tekst]) => (
                    <option value={val}>{tekst}</option>
                ))}
            </Select>
        </StyledDiv>
    );
};

export default OppgaveFiltering;
