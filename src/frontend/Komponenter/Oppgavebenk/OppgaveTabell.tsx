import React, { useEffect, useState } from 'react';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './typer/oppgave';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import { usePagineringState } from '../../App/hooks/felles/usePaginerState';
import { OppgaveHeaderConfig } from './OppgaveHeaderConfig';
import { IMappe } from './typer/mappe';
import { Pagination, SortState, Table } from '@navikt/ds-react';
import styled from 'styled-components';
import { useApp } from '../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
`;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaver: IOppgave[];
    mapper: IMappe[];
    settFeilmelding: (feilmelding: string) => void;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaver, mapper, settFeilmelding }) => {
    const { axiosRequest } = useApp();

    const [oppgaveListe, settOppgaveListe] = useState<IOppgave[]>(oppgaver);

    useEffect(() => {
        settOppgaveListe(oppgaver);
    }, [oppgaver]);

    const { sortertListe, settSortering, sortConfig } = useSorteringState<IOppgave>(oppgaveListe, {
        orderBy: 'fristFerdigstillelse',
        direction: 'ascending',
    });

    const { valgtSide, settValgtSide, slicedListe, antallSider } = usePagineringState(
        sortertListe,
        1,
        15
    );
    const mapperAsRecord = (mapper: IMappe[]): Record<number, string> =>
        mapper.reduce(
            (acc, item) => {
                acc[item.id] = item.navn;
                return acc;
            },
            {} as Record<number, string>
        );

    const formaterteMapper = mapperAsRecord(mapper);

    const hentOppgavePåNytt = (oppgaveId: string) => {
        axiosRequest<IOppgave, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/oppslag/${oppgaveId}`,
        }).then((res: RessursSuksess<IOppgave> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settOppgaveListe((prevState) =>
                    prevState.map((oppgave) => {
                        if (oppgave.id.toString() == oppgaveId) {
                            return res.data;
                        }
                        return oppgave;
                    })
                );
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    return (
        <>
            {antallSider > 1 && (
                <FlexBox>
                    <Pagination page={valgtSide} count={antallSider} onPageChange={settValgtSide} />
                </FlexBox>
            )}
            <Table
                zebraStripes={true}
                sort={sortConfig as SortState}
                onSortChange={(sortKey) => settSortering(sortKey as keyof IOppgave)}
            >
                <Table.Header>
                    <Table.Row>
                        {OppgaveHeaderConfig.map((header) => (
                            <Table.ColumnHeader
                                textSize={'small'}
                                key={header.tekst}
                                sortKey={header.feltNavn}
                                sortable={header.erSorterbar}
                            >
                                {header.tekst}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {slicedListe.map((v) => (
                        <OppgaveRad
                            key={v.id}
                            oppgave={v}
                            mapper={formaterteMapper}
                            settFeilmelding={settFeilmelding}
                            hentOppgavePåNytt={() => hentOppgavePåNytt(v.id.toString())}
                        />
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};

export default OppgaveTabell;
