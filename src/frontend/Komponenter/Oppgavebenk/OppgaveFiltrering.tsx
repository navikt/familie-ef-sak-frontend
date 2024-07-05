import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { oppgaveTypeTilTekst } from './typer/oppgavetype';
import { behandlingstemaStønadstypeTilTekst } from '../../App/typer/behandlingstema';
import { useApp } from '../../App/context/AppContext';
import CustomSelect from './CustomSelect';
import { enhetTilTekst, FortroligEnhet, IkkeFortroligEnhet } from './typer/enhet';
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
import { harEgenAnsattRolle, harStrengtFortroligRolle } from '../../App/utils/roller';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { Alert, Button, Select, TextField } from '@navikt/ds-react';
import SystemetLaster from '../../Felles/SystemetLaster/SystemetLaster';

export const FlexDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1.5rem;
    row-gap: 1rem;
`;

const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
`;

const AlertStripe = styled(Alert)`
    width: 33rem;
`;

const ModalKnapp = styled(Button)`
    margin-top: 1rem;
    margin-bottom: 2rem;
    float: right;
`;

const FiltreringKnapp = styled(Button)`
    margin-right: 1.5rem;
`;

interface IOppgaveFiltrering {
    hentOppgaver: (data: IOppgaveRequest) => void;
    mapper: IMappe[];
    feilmelding: string;
    settFeilmelding: (feilmelding: string) => void;
}

interface Feil {
    opprettetPeriodeFeil: OrNothing<string>;
    fristPeriodeFeil: OrNothing<string>;
}

const initFeilObjekt = {} as Feil;

const oppgaveRequestMedDefaultEnhet = (
    oppgaveRequest: IOppgaveRequest,
    harSaksbehandlerStrengtFortroligRolle: boolean
): IOppgaveRequest => {
    if (harSaksbehandlerStrengtFortroligRolle) {
        return {
            ...oppgaveRequest,
            enhet: FortroligEnhet.VIKAFOSSEN,
        };
    } else {
        const enhet = oppgaveRequest.enhet;
        return {
            ...oppgaveRequest,
            enhet: enhet || IkkeFortroligEnhet.NAY,
        };
    }
};

const OppgaveFiltrering: React.FC<IOppgaveFiltrering> = ({
    hentOppgaver,
    mapper,
    feilmelding,
    settFeilmelding,
}) => {
    const { innloggetSaksbehandler, appEnv } = useApp();
    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(
        appEnv,
        innloggetSaksbehandler
    );
    const harSaksbehandlerEgenAnsattRolle = harEgenAnsattRolle(appEnv, innloggetSaksbehandler);
    const tomOppgaveRequest = harSaksbehandlerStrengtFortroligRolle
        ? { enhet: FortroligEnhet.VIKAFOSSEN }
        : { enhet: IkkeFortroligEnhet.NAY };
    const [oppgaveRequest, settOppgaveRequest] = useState<IOppgaveRequest>({});
    const [periodeFeil, settPerioderFeil] = useState<Feil>(initFeilObjekt);
    const [lasterFraLokalt, settLasterFraLokalt] = useState(true);

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
        const fraLocalStorage = hentFraLocalStorage<IOppgaveRequest>(
            oppgaveRequestKey(innloggetSaksbehandler.navIdent),
            {}
        );

        const oppgaveRequestMedEnhet = oppgaveRequestMedDefaultEnhet(
            fraLocalStorage,
            harSaksbehandlerStrengtFortroligRolle
        );
        settOppgaveRequest(oppgaveRequestMedEnhet);
        settLasterFraLokalt(false);
        hentOppgaver(oppgaveRequestMedEnhet);
    }, [hentOppgaver, harSaksbehandlerStrengtFortroligRolle, innloggetSaksbehandler.navIdent]);

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
        lagreTilLocalStorage(oppgaveRequestKey(innloggetSaksbehandler.navIdent), oppgaveRequest);
        hentOppgaver(oppgaveRequest);
    };

    const tilbakestillFiltrering = () => {
        lagreTilLocalStorage(oppgaveRequestKey(innloggetSaksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
        hentOppgaver(tomOppgaveRequest);
    };

    return lasterFraLokalt ? (
        <SystemetLaster />
    ) : (
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
                    id={'regdato' + oppgaveRequest.opprettetFom + oppgaveRequest.opprettetTom}
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
                    options={behandlingstemaStønadstypeTilTekst}
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
                    id={'frist'}
                />
                <CustomSelect
                    onChange={settOppgave('enhet')}
                    label="Enhet"
                    options={enhetTilTekst(
                        harSaksbehandlerStrengtFortroligRolle,
                        harSaksbehandlerEgenAnsattRolle
                    )}
                    value={oppgaveRequest.enhet}
                    sortDesc={true}
                    skalSkjuleValgetAlle={true}
                />
                <MappeVelger
                    onChange={(val) => {
                        if (val === 'uplassert') {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                return { ...prevState, erUtenMappe: true, mappeId: undefined };
                            });
                        } else {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                return { ...prevState, erUtenMappe: false, mappeId: parseInt(val) };
                            });
                        }
                    }}
                    label="Enhetsmappe"
                    options={mapper}
                    value={oppgaveRequest.mappeId}
                    erUtenMappe={oppgaveRequest.erUtenMappe}
                />
                <Select
                    value={saksbehandlerTekst}
                    label="Saksbehandler"
                    onChange={(event) => {
                        event.persist();
                        const val = event.target.value;
                        if (val === '') {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return rest;
                            });
                        } else if (val === 'Fordelte' || val === 'Ufordelte') {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                                return {
                                    ...rest,
                                    tildeltRessurs: val === 'Fordelte',
                                };
                            });
                        } else {
                            settOppgaveRequest((prevState: IOppgaveRequest) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                <TextField
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
                    autoComplete="off"
                />
            </FlexDiv>
            <KnappWrapper>
                <FiltreringKnapp onClick={sjekkFeilOgHentOppgaver} type={'submit'}>
                    Hent oppgaver
                </FiltreringKnapp>
                <FiltreringKnapp
                    variant={'secondary'}
                    onClick={tilbakestillFiltrering}
                    type={'button'}
                >
                    Tilbakestill filtrering
                </FiltreringKnapp>
            </KnappWrapper>
            <ModalWrapper tittel={'Ugyldig oppgave eller annet feil'} visModal={!!feilmelding}>
                <AlertStripe variant={'warning'}>{feilmelding}</AlertStripe>
                <ModalKnapp
                    variant={'primary'}
                    onClick={() => {
                        settFeilmelding('');
                        sjekkFeilOgHentOppgaver();
                    }}
                    type={'submit'}
                >
                    Hent oppgaver
                </ModalKnapp>
            </ModalWrapper>
        </>
    );
};

export default OppgaveFiltrering;
