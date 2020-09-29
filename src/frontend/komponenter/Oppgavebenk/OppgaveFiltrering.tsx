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
    enhetsmappe?: string;
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

const oppdaterFilter = (
    object: IOppgaveRequest,
    key: keyof IOppgaveRequest,
    val?: string
): IOppgaveRequest => {
    if (!val || val === '') {
        const { [key]: dummy, ...remainder } = object;
        return remainder;
    }
    return {
        ...object,
        [key]: val,
    };
};

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
                            setOppgaveRequest((prevState: IOppgaveRequest) =>
                                oppdaterFilter(prevState, 'opprettet', dato)
                            )
                        }
                        valgtDato={oppgaveRequest.opprettet}
                    />
                </div>
                <Select
                    value={oppgaveRequest.oppgavetype || ''}
                    className="flex-item"
                    label="Oppgavetype"
                    onChange={(event) => {
                        event.persist();
                        const oppgavetype = event.target.value;
                        setOppgaveRequest((prevState: IOppgaveRequest) =>
                            oppdaterFilter(prevState, 'oppgavetype', oppgavetype)
                        );
                    }}
                >
                    <option value="">Alle</option>
                    {Object.entries(oppgaveTypeTilTekst).map(([val, tekst]) => (
                        <option key={val} value={val}>
                            {tekst}
                        </option>
                    ))}
                </Select>
                <Select
                    value={oppgaveRequest.behandlingstema || ''}
                    className="flex-item"
                    label="Gjelder"
                    onChange={(event) => {
                        event.persist();
                        const behandlingstema = event.target.value;
                        setOppgaveRequest((prevState: IOppgaveRequest) =>
                            oppdaterFilter(prevState, 'behandlingstema', behandlingstema)
                        );
                    }}
                >
                    <option value="">Alle</option>
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
                            setOppgaveRequest((prevState: IOppgaveRequest) =>
                                oppdaterFilter(prevState, 'frist', dato)
                            )
                        }
                        valgtDato={oppgaveRequest.frist}
                    />
                </div>
                <Select
                    value={oppgaveRequest.enhet || ''}
                    className="flex-item"
                    label="Enhet"
                    onChange={(event) => {
                        event.persist();
                        const enhet = event.target.value;
                        setOppgaveRequest((prevState: IOppgaveRequest) =>
                            oppdaterFilter(prevState, 'enhet', enhet)
                        );
                    }}
                >
                    <option value="">Alle enheter</option>
                    <option value="4415">4415 Molde</option>
                    <option value="4408">4408 Skien</option>
                    <option value="1505">1505 Kristiansand</option>
                </Select>
                <Select
                    value={oppgaveRequest.enhetsmappe || ''}
                    className="flex-item"
                    label="Enhetsmappe"
                    onChange={(event) => {
                        event.persist();
                        const enhetsmappe = event.target.value;
                        setOppgaveRequest((prevState: IOppgaveRequest) =>
                            oppdaterFilter(prevState, 'enhetsmappe', enhetsmappe)
                        );
                    }}
                >
                    <option value="">Alle enhetsmapper</option>
                    <option value="100000035">10 Søknader - Klar til behandling</option>
                    <option value="100000036">20 Avventer dokumentasjon</option>
                    <option value="100000037">30 Klager - Klar til behandling</option>
                    <option value="100000038">40 Revurdering - Klar til behandling</option>
                    <option value="100000039">41 Revurdering</option>
                    <option value="100024196">42 Oppfølging av skolesaker</option>
                    <option value="100000266">50 Tilbakekreving - Klar til behandling</option>
                    <option value="100024195">70 Flyttesaker</option>
                    <option value="100025358">81 EØS medlemskap</option>
                    <option value="100025133">90 Corona</option>
                </Select>

                <Select
                    value={oppgaveRequest.saksbehandler || ''}
                    className="flex-item"
                    label="Saksbehandler"
                    onChange={(event) => {
                        event.persist();
                        const val = event.target.value;
                        if (val === '') {
                            setOppgaveRequest((prevState: IOppgaveRequest) => {
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return rest;
                            });
                        } else if (val === 'Fordelte' || val === 'Ufordelte') {
                            setOppgaveRequest((prevState: IOppgaveRequest) => {
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return {
                                    ...rest,
                                    tildeltRessurs: val === 'Fordelte',
                                };
                            });
                        } else {
                            setOppgaveRequest((prevState: IOppgaveRequest) => {
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return {
                                    ...rest,
                                    tilordnetRessurs: val,
                                };
                            });
                        }
                    }}
                >
                    <option value="">Alle</option>
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
                <Knapp
                    className="flex-item"
                    onClick={() => {
                        setOppgaveRequest(initOppgaveRequest);
                        hentOppgaver(oppgaveRequest);
                    }}
                >
                    Tilbakestill filtrering
                </Knapp>
            </KnappWrapper>
        </>
    );
};

export default OppgaveFiltering;
