import React from 'react';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './typer/oppgave';
import 'nav-frontend-tabell-style';
import OppgaveSorteringsHeader from './OppgaveSorteringHeader';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import { usePagineringState } from '../../App/hooks/felles/usePaginerState';
import { OppgaveHeaderConfig } from './OppgaveHeaderConfig';
import { IMappe } from './typer/mappe';
import { Pagination } from '@navikt/ds-react';
import styled from 'styled-components';

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
`;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveResponse: IOppgaverResponse;
    mapper: IMappe[];
    settFeilmelding: (feilmelding: string) => void;
    oppdaterOppgave: (oppgaveId: string) => void;
}

const OppgaveTabell: React.FC<Props> = ({
    oppgaveResponse,
    mapper,
    settFeilmelding,
    oppdaterOppgave,
}) => {
    const oppgaveListe = oppgaveResponse.oppgaver;

    const { sortertListe, settSortering, sortConfig } = useSorteringState<IOppgave>(oppgaveListe, {
        sorteringsfelt: 'fristFerdigstillelse',
        rekkefolge: 'ascending',
    });

    const { valgtSide, settValgtSide, slicedListe, antallSider } = usePagineringState(
        sortertListe,
        1,
        15
    );
    const mapperAsRecord = (mapper: IMappe[]): Record<number, string> =>
        mapper.reduce((acc, item) => {
            acc[item.id] = item.navn;
            return acc;
        }, {} as Record<number, string>);

    const formaterteMapper = mapperAsRecord(mapper);

    return (
        <>
            {antallSider > 1 && (
                <FlexBox>
                    <Pagination page={valgtSide} count={antallSider} onPageChange={settValgtSide} />
                </FlexBox>
            )}
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
                            opppdaterOppgave={() => oppdaterOppgave(v.id.toString())}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
