import React from 'react';
import { RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import SystemetLaster from '../../Felles/SystemetLaster/SystemetLaster';
import { OppgaveRessurs } from './OppgavebenkApp';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './typer/oppgave';
import 'nav-frontend-tabell-style';
import OppgaveSorteringsHeader from './OppgaveSorteringHeader';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import { usePagineringState } from '../../App/hooks/felles/usePaginerState';
import { OppgaveHeaderConfig } from './OppgaveHeaderConfig';
import AlertStripeFeilPreWrap from '../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { IMappe } from './typer/mappe';
import { AlertError, AlertInfo } from '../../Felles/Visningskomponenter/Alerts';
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

    const { valgtSide, settValgtSide, slicedListe, antallSider } = usePagineringState(
        status === RessursStatus.SUKSESS ? sortertListe : [],
        1,
        15
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
        return <AlertError children="Ikke tilgang!" />;
    } else if (
        oppgaveRessurs.status === RessursStatus.FEILET ||
        oppgaveRessurs.status === RessursStatus.FUNKSJONELL_FEIL
    ) {
        return (
            <AlertStripeFeilPreWrap
                children={`Noe gikk galt - ${oppgaveRessurs.frontendFeilmelding}`}
            />
        );
    } else if (status === RessursStatus.IKKE_HENTET) {
        return <AlertInfo> Du må utføre et søk for å se oppgaver i listen.</AlertInfo>;
    }

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
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
