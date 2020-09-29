import React, { useState } from 'react';
import { Datovelger } from 'nav-datovelger';
import styled from 'styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Oppgavetype, oppgaveTypeTilTekst } from './oppgavetema';
import { Behandlingstema, behandlingstemaTilTekst } from './behandlingstema';
import { useApp } from '../../context/AppContext';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
`;

export interface IOppgaveRequest {
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    enhet?: string;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettet?: string;
    frist?: string;
}

interface IOppgaveFiltrering {
    hentOppgaver: (data: IOppgaveRequest) => void;
}

const initOppgaveRequest = {} as IOppgaveRequest;

const OppgaveFiltering: React.FC<IOppgaveFiltrering> = ({ hentOppgaver }) => {
    const [oppgaveRequest, setOppgaveRequest] = useState<IOppgaveRequest>(initOppgaveRequest);
    const { innloggetSaksbehandler } = useApp();

    return (
        <StyledDiv>
            <div className="skjemaelement">
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdato">
                    Reg. dato
                </DatolabelStyle>
                <Datovelger
                    onChange={(dato) =>
                        setOppgaveRequest((prevState: IOppgaveRequest) => ({
                            ...prevState,
                            opprettet: dato,
                        }))
                    }
                    valgtDato={oppgaveRequest.opprettet}
                />
            </div>
            <Select
                label="Oppgavetype"
                onChange={(event) => {
                    event.persist();
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        oppgavetype: event.target.value as Oppgavetype,
                    }));
                }}
            >
                {Object.entries(oppgaveTypeTilTekst).map(([val, tekst]) => (
                    <option key={val} value={val}>
                        {tekst}
                    </option>
                ))}
            </Select>
            <Select
                label="Gjelder"
                onChange={(event) => {
                    event.persist();
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        behandlingstema: event.target.value as Behandlingstema,
                    }));
                }}
            >
                {Object.entries(behandlingstemaTilTekst).map(([val, tekst]) => (
                    <option key={val} value={val}>
                        {tekst}
                    </option>
                ))}
            </Select>
            <div className="skjemaelement">
                <DatolabelStyle className="skjemaelement__label" htmlFor="frist">
                    Frist
                </DatolabelStyle>
                <Datovelger
                    onChange={(dato) =>
                        setOppgaveRequest((prevState: IOppgaveRequest) => ({
                            ...prevState,
                            frist: dato,
                        }))
                    }
                    valgtDato={oppgaveRequest.opprettet}
                />
            </div>
            <Select
                label="Enhet"
                onChange={(event) => {
                    event.persist();
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        behandlingstema: event.target.value as Behandlingstema,
                    }));
                }}
            >
                {Object.entries(behandlingstemaTilTekst).map(([val, tekst]) => (
                    <option key={val} value={val}>
                        {tekst}
                    </option>
                ))}
            </Select>

            <Select
                label="Enhet"
                onChange={(event) => {
                    event.persist();
                    setOppgaveRequest((prevState: IOppgaveRequest) => ({
                        ...prevState,
                        behandlingstema: event.target.value as Behandlingstema,
                    }));
                }}
            >
                <option value="Fordelte">Fordelte</option>
                <option value="Ufordelte">Ufordelte</option>
                {innloggetSaksbehandler && (
                    <option value={innloggetSaksbehandler.identifier}>
                        {`${innloggetSaksbehandler.firstName} ${innloggetSaksbehandler.lastName}`}
                    </option>
                )}
            </Select>
            <Hovedknapp onClick={() => hentOppgaver(oppgaveRequest)}>Hent oppgaver</Hovedknapp>
            <Knapp onClick={() => setOppgaveRequest(initOppgaveRequest)}>
                Tilbakestill filtrering
            </Knapp>
        </StyledDiv>
    );
};

export default OppgaveFiltering;
