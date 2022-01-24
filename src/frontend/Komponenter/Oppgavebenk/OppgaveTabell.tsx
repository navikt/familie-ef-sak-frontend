import React from 'react';
import { RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import SystemetLaster from '../../Felles/SystemetLaster/SystemetLaster';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { OppgaveRessurs } from './OppgavebenkApp';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './typer/oppgave';
import 'nav-frontend-tabell-style';
import OppgaveSorteringsHeader from './OppgaveSorteringHeader';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import { usePagineringState } from '../../App/hooks/felles/usePaginerState';
import { OppgaveHeaderConfig } from './OppgaveHeaderConfig';
import Pagination from 'paginering';
import AlertStripeFeilPreWrap from '../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { IMappe } from './typer/mappe';

const SIDE_STORRELSE = 15;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveRessurs: OppgaveRessurs;
    mapper: IMappe[];
    settFeilmelding: (feilmelding: string) => void;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaveRessurs, mapper, settFeilmelding }) => {
    const { status } = oppgaveRessurs;
    const oppgaveListe =
        status === RessursStatus.SUKSESS
            ? (oppgaveRessurs as RessursSuksess<IOppgaverResponse>).data.oppgaver
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
    const mapperAsRecord = (mapper: IMappe[]): Record<number, string> =>
        mapper.reduce((acc, item) => {
            acc[item.id] = item.navn;
            return acc;
        }, {} as Record<number, string>);

    const formaterteMapper = mapperAsRecord(mapper);

    if (status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (oppgaveRessurs.status === RessursStatus.FEILET) {
        return (
            <AlertStripeFeilPreWrap
                children={`Noe gikk galt - ${oppgaveRessurs.frontendFeilmelding}`}
            />
        );
    } else if (status === RessursStatus.IKKE_HENTET) {
        return <AlertStripeInfo> Du må utføre et søk for å se oppgaver i listen.</AlertStripeInfo>;
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
                        <OppgaveRad
                            key={v.id}
                            oppgave={v}
                            mapper={formaterteMapper}
                            settFeilmelding={settFeilmelding}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
