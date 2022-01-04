import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Input, Select } from 'nav-frontend-skjema';
import { oppgaveTypeTilTekst } from './typer/oppgavetema';
import { behandlingstemaTilTekst } from '../../App/typer/behandlingstema';
import { useApp } from '../../App/context/AppContext';
import CustomSelect from './CustomSelect';
import { enhetTilTekst } from './typer/enhet';
import DatoPeriode from './DatoPeriode';
import { datoFeil, oppdaterFilter } from '../../App/utils/utils';
import { IOppgaveRequest } from './typer/oppgaverequest';
import { OrNothing } from '../../App/hooks/felles/useSorteringState';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from './oppgavefilterStorage';
import MappeVelger from './MappeVelger';
import { IMappe } from './typer/mappe';

export const FlexDiv = styled.div<{ flexDirection?: 'row' | 'column' }>`
    display: flex;
    flex-direction: ${(props) => props.flexDirection ?? 'row'};
    flex-wrap: wrap;

    .flex-item {
        padding-right: 1.5rem;
        padding-bottom: 1.5rem;
    }
`;

export const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .flex-item {
        margin-right: 1.5rem;
    }
`;

interface IOppgaveFiltrering {
    hentOppgaver: (data: IOppgaveRequest) => void;
    mapper: IMappe[];
}

interface Feil {
    opprettetPeriodeFeil: OrNothing<string>;
    fristPeriodeFeil: OrNothing<string>;
}

const initFeilObjekt = {} as Feil;

const OppgaveFiltrering: React.FC<IOppgaveFiltrering> = ({ hentOppgaver, mapper }) => {
    const { innloggetSaksbehandler } = useApp();
    const tomOppgaveRequest = {};
    const [oppgaveRequest, settOppgaveRequest] = useState<IOppgaveRequest>({});
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
        const fraLocalStorage = hentFraLocalStorage(oppgaveRequestKey, undefined);
        if (fraLocalStorage) {
            settOppgaveRequest(fraLocalStorage);
            hentOppgaver(fraLocalStorage);
        }
    }, [hentOppgaver]);

    const saksbehandlerTekst =
        oppgaveRequest.tildeltRessurs === undefined && oppgaveRequest.tilordnetRessurs === undefined
            ? 'Alle'
            : oppgaveRequest.tilordnetRessurs
            ? oppgaveRequest.tilordnetRessurs
            : oppgaveRequest.tildeltRessurs
            ? 'Fordelte'
            : 'Ufordelte';

    const sjekkFeilOgHentOppgaver = () => {
        if (Object.values(periodeFeil).some((val?: string) => val)) {
            return;
        }
        lagreTilLocalStorage(oppgaveRequestKey, oppgaveRequest);
        hentOppgaver(oppgaveRequest);
    };

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
                    sortDesc={true}
                />
                <MappeVelger
                    onChange={(val) => settOppgave('mappeId')(parseInt(val))}
                    label="Enhetsmappe"
                    options={mapper}
                    value={oppgaveRequest.mappeId}
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
                    value={oppgaveRequest.ident || ''}
                    label="Personident"
                    inputMode="numeric"
                    onChange={(e) => {
                        settOppgave('ident')(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sjekkFeilOgHentOppgaver();
                        }
                    }}
                />
            </FlexDiv>

            <KnappWrapper>
                <Hovedknapp className="flex-item" onClick={sjekkFeilOgHentOppgaver}>
                    Hent oppgaver
                </Hovedknapp>
                <Knapp
                    className="flex-item"
                    onClick={() => {
                        lagreTilLocalStorage(oppgaveRequestKey, tomOppgaveRequest);
                        settOppgaveRequest(tomOppgaveRequest);
                        hentOppgaver(tomOppgaveRequest);
                    }}
                >
                    Tilbakestill filtrering
                </Knapp>
            </KnappWrapper>
        </>
    );
};

export default OppgaveFiltrering;
