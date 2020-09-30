import React from 'react';
import { RessursStatus, RessursSuksess } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { OppgaveResurs } from '../../sider/Oppgavebenk';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './oppgave';
import 'nav-frontend-tabell-style';
import Paginering from './Paginering';
import OppgaveSorteringsHeader from './OppgaveSorteringHeader';
import { useSorteringState } from '../../hooks/useSorteringState';
import { usePagineringState } from '../../hooks/usePaginerState';
const SIDE_STORRELSE = 15;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveResurs: OppgaveResurs;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaveResurs }) => {
    const { status } = oppgaveResurs;
    const oppgaveListe =
        status === RessursStatus.SUKSESS
            ? (oppgaveResurs as RessursSuksess<IOppgaverResponse>).data.oppgaver
            : [];

    const { sortertListe, settSortering, sortConfig } = useSorteringState<IOppgave>(oppgaveListe);

    const { valgtSide, settValgtSide, slicedListe } = usePagineringState(
        status === RessursStatus.SUKSESS ? sortertListe : [],
        1,
        SIDE_STORRELSE
    );

    if (status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (status === RessursStatus.FEILET) {
        return <AlertStripeFeil children="Noe gikk galt" />;
    } else if (status === RessursStatus.IKKE_HENTET) {
        return <Normaltekst> Du må gjøre ett søk før att få opp træff!!!</Normaltekst>; //TODO FIKS TEKST
    }

    return (
        <>
            <Paginering
                antallTotalt={sortertListe.length}
                settValgtSide={settValgtSide}
                sideStorrelse={SIDE_STORRELSE}
                valgtSide={valgtSide}
            />
            <table className="tabell tabell--stripet">
                <thead>
                    <tr>
                        <OppgaveSorteringsHeader
                            tekst="Reg.dato"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'opprettetTidspunkt'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('opprettetTidspunkt')}
                        />
                        <OppgaveSorteringsHeader
                            tekst="Oppgavetype"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'oppgavetype'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('oppgavetype')}
                        />
                        <OppgaveSorteringsHeader
                            tekst="Gjelder"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'behandlingstema'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('behandlingstema')}
                        />
                        <OppgaveSorteringsHeader
                            tekst="Frist"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'fristFerdigstillelse'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('fristFerdigstillelse')}
                        />
                        <OppgaveSorteringsHeader
                            tekst="Prioritet"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'prioritet'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('prioritet')}
                        />
                        <th role="columnheader">Beskrivelse</th>
                        <th role="columnheader">Bruker</th>
                        <OppgaveSorteringsHeader
                            tekst="Enhet"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'tildeltEnhetsnr'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('tildeltEnhetsnr')}
                        />
                        <OppgaveSorteringsHeader
                            tekst="Enhetsmappe"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'mappeId'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('mappeId')}
                        />
                        <OppgaveSorteringsHeader
                            tekst="Saksbehandler"
                            rekkefolge={
                                sortConfig?.sorteringsfelt === 'samhandlernr'
                                    ? sortConfig.rekkefolge
                                    : undefined
                            }
                            onClick={() => settSortering('samhandlernr')}
                        />
                        <th role="columnheader">Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {slicedListe.map((v) => (
                        <OppgaveRad oppgave={v} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
