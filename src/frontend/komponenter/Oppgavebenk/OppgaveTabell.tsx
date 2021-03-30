import React from 'react';
import { RessursStatus, RessursSuksess } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { OppgaveRessurs } from '../../sider/Oppgavebenk';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './oppgave';
import 'nav-frontend-tabell-style';
import OppgaveSorteringsHeader from './OppgaveSorteringHeader';
import { useSorteringState } from '../../hooks/felles/useSorteringState';
import { usePagineringState } from '../../hooks/felles/usePaginerState';
import { OppgaveHeaderConfig } from './OppgaveHeaderConfig';
import Pagination from 'paginering';

const SIDE_STORRELSE = 15;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveResurs: OppgaveRessurs;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaveResurs }) => {
    const { status } = oppgaveResurs;
    const oppgaveListe =
        status === RessursStatus.SUKSESS
            ? (oppgaveResurs as RessursSuksess<IOppgaverResponse>).data.oppgaver
            : [];

    const { sortertListe, settSortering, sortConfig } = useSorteringState<IOppgave>(oppgaveListe, {
        sorteringsfelt: 'fristFerdigstillelse',
        rekkefolge: 'ascending',
    });

    const { valgtSide, settValgtSide, slicedListe } = usePagineringState(
        status === RessursStatus.SUKSESS ? sortertListe : [],
        1,
        SIDE_STORRELSE
    );

    if (status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (oppgaveResurs.status === RessursStatus.FEILET) {
        return (
            <AlertStripeFeil children={`Noe gikk galt - ${oppgaveResurs.frontendFeilmelding}`} />
        );
    } else if (status === RessursStatus.IKKE_HENTET) {
        return <AlertStripeInfo> Du må gjøre ett søk for å se oppgaver i listen.</AlertStripeInfo>; //TODO FIKS TEKST
    }

    return (
        <>
            <Pagination
                numberOfItems={sortertListe.length}
                onChange={settValgtSide}
                itemsPerPage={SIDE_STORRELSE}
                currentPage={valgtSide}
            />
            <table className="tabell tabell--stripet">
                <thead>
                    <tr>
                        {OppgaveHeaderConfig.map((header) =>
                            header.erSorterbar ? (
                                <OppgaveSorteringsHeader
                                    key={header.tekst}
                                    tekst={header.tekst}
                                    rekkefolge={
                                        sortConfig?.sorteringsfelt === header.feltNavn
                                            ? sortConfig?.rekkefolge
                                            : undefined
                                    }
                                    onClick={() => settSortering(header.feltNavn as keyof IOppgave)}
                                />
                            ) : (
                                <th key={header.tekst} role="columnheader">
                                    {header.tekst}
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {slicedListe.map((v) => (
                        <OppgaveRad key={v.id} oppgave={v} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
