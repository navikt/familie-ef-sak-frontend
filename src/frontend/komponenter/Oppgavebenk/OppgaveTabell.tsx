import React, { useState } from 'react';
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
import { useSorteringMemo } from '../../hooks/useMemoSortering';

const SIDE_STORRELSE = 15;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveResurs: OppgaveResurs;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaveResurs }) => {
    const [valgtSide, settValgtSide] = useState<number>(1);
    const { sortConfig, settSortering } = useSorteringState<IOppgave>();
    const { status } = oppgaveResurs;

    const sortertListe = useSorteringMemo(
        status === RessursStatus.SUKSESS
            ? (oppgaveResurs as RessursSuksess<IOppgaverResponse>).data.oppgaver
            : [],
        sortConfig
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

    const sliceOppgaveListe = sortertListe.slice(
        (valgtSide - 1) * SIDE_STORRELSE,
        valgtSide * SIDE_STORRELSE
    );

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
                            rekkefolge="ascending"
                            onClick={() => settSortering('opprettetTidspunkt')}
                        />
                        <th role="columnheader" aria-sort="none">
                            Oppgavetype
                        </th>
                        <th
                            role="columnheader"
                            aria-sort="descending"
                            className="tabell__th--sortert-desc"
                        >
                            Gjelder
                        </th>
                        <th role="columnheader" aria-sort="none">
                            Frist
                        </th>
                        <th role="columnheader" aria-sort="none">
                            Prioritet
                        </th>
                        <th role="columnheader" aria-sort="none">
                            Beskrivelse
                        </th>
                        <th role="columnheader" aria-sort="none">
                            Bruker
                        </th>
                        <th
                            role="columnheader"
                            aria-sort="descending"
                            className="tabell__th--sortert-desc"
                        >
                            Enhet
                        </th>
                        <th
                            role="columnheader"
                            aria-sort="descending"
                            className="tabell__th--sortert-desc"
                        >
                            Enhetsmappe
                        </th>
                        <th
                            role="columnheader"
                            aria-sort="descending"
                            className="tabell__th--sortert-desc"
                        >
                            Saksbehandler
                        </th>
                        <th
                            role="columnheader"
                            aria-sort="descending"
                            className="tabell__th--sortert-desc"
                        >
                            Handlinger
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sliceOppgaveListe.map((v) => (
                        <OppgaveRad oppgave={v} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
