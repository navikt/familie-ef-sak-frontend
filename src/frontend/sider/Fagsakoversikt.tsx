import React, { useMemo } from 'react';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import Visittkort from '@navikt/familie-visittkort';
import { kjønnType } from '@navikt/familie-typer';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import { useParams } from 'react-router';
import { Behandling, Fagsak } from '../typer/fagsak';
import DataViewer from '../komponenter/Felleskomponenter/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { formaterIsoDato } from '../utils/formatter';
import { formatterEnumVerdier } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useSorteringState } from '../hooks/felles/useSorteringState';
import SorteringsHeader from '../komponenter/Oppgavebenk/OppgaveSorteringHeader';

const VisittkortWrapper = styled.div`
    .visittkort {
        padding: 0 1.5rem;
    }
`;

const TittelWrapper = styled.div`
    padding: 2rem 2rem 1rem 2rem;
`;

const Fagsakoversikt: React.FC = () => {
    const { fagsakId } = useParams<{ fagsakId: string }>();

    const a: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const fagsak = useDataHenter<Fagsak, null>(a);

    return (
        <DataViewer response={fagsak}>
            {(data) => {
                return (
                    <>
                        <VisittkortWrapper className="blokk-s">
                            <Visittkort
                                alder={19}
                                ident="007"
                                kjønn={kjønnType.MANN}
                                navn="Batman"
                            />
                        </VisittkortWrapper>
                        <TittelWrapper>
                            <Innholdstittel className="blokk-m" tag="h2">
                                Behandlingsoversikt - Batman{' '}
                            </Innholdstittel>
                            <Systemtittel tag="h3">
                                Fagsak: {formatterEnumVerdier(data.stønadstype)}
                            </Systemtittel>
                        </TittelWrapper>
                        <FagsakoversiktTabell behandlinger={data.behandlinger} />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Fagsakoversikt;

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

const FagsakoversiktTabell: React.FC<Pick<Fagsak, 'behandlinger'>> = ({ behandlinger }) => {
    const { sortertListe, settSortering, sortConfig } = useSorteringState<Behandling>(
        behandlinger,
        {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'ascending',
        }
    );

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'opprettet'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Behandling opprettetdato"
                        onClick={() => settSortering('opprettet')}
                    />
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'type'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Type"
                        onClick={() => settSortering('type')}
                    />
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'status'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Status"
                        onClick={() => settSortering('status')}
                    />
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'resultat'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Resultat"
                        onClick={() => settSortering('resultat')}
                    />
                </tr>
            </thead>
            <tbody>
                {sortertListe.map((behandling) => {
                    return (
                        <tr key={behandling.id}>
                            <td>{formaterIsoDato(behandling.opprettet)}</td>
                            <td>{formatterEnumVerdier(behandling.type)}</td>
                            <td>{formatterEnumVerdier(behandling.status)}</td>
                            <td>
                                <Link
                                    className="lenke"
                                    to={{ pathname: `/behandling/${behandling.id}` }}
                                >
                                    {formatterEnumVerdier(behandling.resultat)}
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};
