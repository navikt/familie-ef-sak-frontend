import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Input, Select } from 'nav-frontend-skjema';
import { oppgaveTypeTilTekst } from './oppgavetema';
import { behandlingstemaTilTekst } from '../../typer/behandlingstema';
import { useApp } from '../../context/AppContext';
import { enhetsmappeTilTekst } from './enhetsmappe';
import CustomSelect from './CustomSelect';
import { enhetTilTekst } from './enhet';
import DatoPeriode from './DatoPeriode';
import { datoFeil, oppdaterFilter } from '../../utils/utils';
import { IOppgaveRequest } from './oppgaverequest';
import { OrNothing } from '../../hooks/felles/useSorteringState';

export const FlexDiv = styled.div`
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

interface IOppgaveFiltrering {
    hentOppgaver: (data: IOppgaveRequest) => void;
}

interface Feil {
    opprettetPeriodeFeil: OrNothing<string>;
    fristPeriodeFeil: OrNothing<string>;
}

const initFeilObjekt = {} as Feil;

const filterVersjon = 'v1';
const filterVersjonKey = 'filterVersjon';
const oppgaveRequestKey = 'oppgaveFiltreringRequest';

export const persisterRequestTilLocalStorage = (request: IOppgaveRequest) => {
    try {
        localStorage.setItem(filterVersjonKey, filterVersjon);
        localStorage.setItem(oppgaveRequestKey, JSON.stringify(request));
    } finally {
        /* Gjør ingenting */
    }
};

const OppgaveFiltering: React.FC<IOppgaveFiltrering> = ({ hentOppgaver }) => {
    const { innloggetSaksbehandler } = useApp();
    const initOppgaveRequest = innloggetSaksbehandler
        ? { tilordnetRessurs: innloggetSaksbehandler.navIdent }
        : ({} as IOppgaveRequest);

    const [oppgaveRequest, settOppgaveRequest] = useState<IOppgaveRequest>(initOppgaveRequest);
    const [requestFraLocalStorage, settRequestFraLocalStorage] = useState<IOppgaveRequest>({});
    const [periodeFeil, settPerioderFeil] = useState<Feil>(initFeilObjekt);

    const settOppgave = (key: keyof IOppgaveRequest) => {
        return (val?: string | number) =>
            settOppgaveRequest((prevState: IOppgaveRequest) => oppdaterFilter(prevState, key, val));
    };

    useEffect(() => {
        const fristPeriodeFeil = datoFeil(oppgaveRequest.fristFom, oppgaveRequest.fristTom);
        settPerioderFeil((prevState) => ({ ...prevState, fristPeriodeFeil }));
    }, [oppgaveRequest.fristTom, oppgaveRequest.fristFom]);

    useEffect(() => {
        const opprettetPeriodeFeil = datoFeil(
            oppgaveRequest.opprettetFom,
            oppgaveRequest.opprettetTom
        );
        settPerioderFeil((prevState) => ({ ...prevState, opprettetPeriodeFeil }));
    }, [oppgaveRequest.opprettetFom, oppgaveRequest.opprettetTom]);

    useEffect(() => {
        try {
            if (localStorage.getItem(filterVersjonKey) !== filterVersjon) {
                localStorage.setItem(filterVersjonKey, filterVersjon);
                localStorage.setItem(oppgaveRequestKey, JSON.stringify({}));
            } else {
                const request = localStorage.getItem(oppgaveRequestKey);
                const parsed = request ? JSON.parse(request) : {};
                hentOppgaver(parsed);
                settOppgaveRequest(parsed);
            }
        } catch {
            /* Gjør ingenting */
        }
    }, []);

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
                <DatoPeriode
                    valgtDatoFra={oppgaveRequest.opprettetFom}
                    valgtDatoTil={oppgaveRequest.opprettetTom}
                    settDatoFra={settOppgave('opprettetFom')}
                    settDatoTil={settOppgave('opprettetTom')}
                    datoFraTekst="Reg.dato fra"
                    datoTilTekst="Reg.dato til"
                    datoFeil={periodeFeil.opprettetPeriodeFeil}
                />
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
                <DatoPeriode
                    valgtDatoFra={oppgaveRequest.fristFom}
                    valgtDatoTil={oppgaveRequest.fristTom}
                    settDatoFra={settOppgave('fristFom')}
                    settDatoTil={settOppgave('fristTom')}
                    datoFraTekst="Frist fra"
                    datoTilTekst="Frist til"
                    datoFeil={periodeFeil.fristPeriodeFeil}
                />
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
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return rest;
                            });
                        } else if (val === 'Fordelte' || val === 'Ufordelte') {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return {
                                    ...rest,
                                    tildeltRessurs: val === 'Fordelte',
                                };
                            });
                        } else {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
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

                <Input
                    defaultValue={oppgaveRequest.ident}
                    label="Personident"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                        settOppgave('ident')(e.target.value);
                    }}
                />
            </FlexDiv>

            <KnappWrapper>
                <Hovedknapp
                    className="flex-item"
                    onClick={() => {
                        if (Object.values(periodeFeil).some((val?: string) => val)) {
                            return;
                        }
                        persisterRequestTilLocalStorage(oppgaveRequest);
                        hentOppgaver(oppgaveRequest);
                    }}
                >
                    Hent oppgaver
                </Hovedknapp>
                <Knapp
                    className="flex-item"
                    onClick={() => {
                        settOppgaveRequest(initOppgaveRequest);
                        persisterRequestTilLocalStorage({});
                        hentOppgaver(initOppgaveRequest);
                    }}
                >
                    Tilbakestill filtrering
                </Knapp>
            </KnappWrapper>
        </>
    );
};

export default OppgaveFiltering;
