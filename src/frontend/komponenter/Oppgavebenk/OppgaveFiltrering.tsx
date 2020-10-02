import React, { useState } from 'react';
import { Datovelger } from 'nav-datovelger';
import styled from 'styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Oppgavetype, oppgaveTypeTilTekst } from './oppgavetema';
import { Behandlingstema, behandlingstemaTilTekst } from './behandlingstema';
import { useApp } from '../../context/AppContext';
import { Enhetsmappe, enhetsmappeTilTekst } from './enhetsmappe';
import CustomSelect from './CustomSelect';
import { Enhet, enhetTilTekst } from './enhet';

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
    enhet?: Enhet;
    enhetsmappe?: Enhetsmappe;
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
    val?: string | number
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

    const settOppgave = (key: keyof IOppgaveRequest) => {
        return (val?: string | number) =>
            setOppgaveRequest((prevState: IOppgaveRequest) => oppdaterFilter(prevState, key, val));
    };

    const saksbehandlerTekst =
        oppgaveRequest.tildeltRessurs === undefined && oppgaveRequest.tilordnetRessurs === undefined
            ? 'Alle'
            : oppgaveRequest.tilordnetRessurs
            ? oppgaveRequest.tilordnetRessurs
            : oppgaveRequest.tildeltRessurs
            ? 'Fordelte'
            : 'Ufordelte';

    return (
        <>
            <FlexDiv>
                <div className="skjemaelement flex-item">
                    <DatolabelStyle className="skjemaelement__label" htmlFor="regdato">
                        Reg. dato
                    </DatolabelStyle>
                    <Datovelger
                        onChange={settOppgave('opprettet')}
                        valgtDato={oppgaveRequest.opprettet}
                    />
                </div>
                <CustomSelect
                    onChange={settOppgave('oppgavetype')}
                    label="Oppgavetype"
                    options={oppgaveTypeTilTekst}
                    value={oppgaveRequest.oppgavetype}
                />
                <CustomSelect
                    onChange={settOppgave('behandlingstema')}
                    label="Gjelder"
                    options={behandlingstemaTilTekst}
                    value={oppgaveRequest.behandlingstema}
                />
                <div className="skjemaelement flex-item">
                    <DatolabelStyle className="skjemaelement__label" htmlFor="frist">
                        Frist
                    </DatolabelStyle>
                    <Datovelger onChange={settOppgave('frist')} valgtDato={oppgaveRequest.frist} />
                </div>
                <CustomSelect
                    onChange={settOppgave('enhet')}
                    label="Enhet"
                    options={enhetTilTekst}
                    value={oppgaveRequest.enhet}
                />
                <CustomSelect
                    onChange={(val) => settOppgave('enhetsmappe')(parseInt(val))}
                    label="Enhetsmappe"
                    options={enhetsmappeTilTekst}
                    value={oppgaveRequest.enhetsmappe}
                />

                <Select
                    value={saksbehandlerTekst}
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
                        hentOppgaver({});
                    }}
                >
                    Tilbakestill filtrering
                </Knapp>
            </KnappWrapper>
        </>
    );
};

export default OppgaveFiltering;
