import React, { useState } from 'react';
import { Datovelger } from 'nav-datovelger';
import styled from 'styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Oppgavetype, oppgaveTypeTilTekst } from './oppgavetema';
import { Behandlingstema, behandlingstemaTilTekst } from './behandlingstema';
import { useApp } from '../../context/AppContext';

const FlexDiv = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .flex-item {
        padding-right: 1.5rem;
        padding-bottom: 1.5rem;
    }
`;

const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .flex-item {
        margin-right: 1.5rem;
    }
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
        <>
            <FlexDiv>
                <div className="skjemaelement flex-item">
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
                    className="flex-item"
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
                    className="flex-item"
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
                <div className="skjemaelement flex-item">
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
                    className="flex-item"
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
                    className="flex-item"
                    label="Saksbehandler"
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
                        <option value={innloggetSaksbehandler.navIdent}>
                            {innloggetSaksbehandler.displayName}
                        </option>
                    )}
                </Select>
            </FlexDiv>

            <KnappWrapper>
                <Hovedknapp className="flex-item" onClick={() => hentOppgaver(oppgaveRequest)}>
                    Hent oppgaver
                </Hovedknapp>
                <Knapp className="flex-item" onClick={() => setOppgaveRequest(initOppgaveRequest)}>
                    Tilbakestill filtrering
                </Knapp>
            </KnappWrapper>
        </>
    );
};

export default OppgaveFiltering;
