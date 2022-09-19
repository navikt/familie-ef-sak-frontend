import React from 'react';
import {
    Behandling,
    BehandlingResultat,
    behandlingResultatInkludertTilbakekrevingTilTekst,
} from '../../App/typer/fagsak';
import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsresultatstype,
    TilbakekrevingBehandlingstype,
} from '../../App/typer/tilbakekreving';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import SorteringsHeader from '../Oppgavebenk/OppgaveSorteringHeader';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { formatterEnumVerdi } from '../../App/utils/utils';
import {
    behandlingOgTilbakekrevingsårsakTilTekst,
    Behandlingsårsak,
    EHenlagtårsak,
    henlagtÅrsakTilTekst,
} from '../../App/typer/Behandlingsårsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import { BehandlingApplikasjon } from './Behandlingsoversikt';
import { PartialRecord } from '../../App/typer/common';
import styled from 'styled-components';
import { klageBaseUrl, tilbakekrevingBaseUrl } from '../../App/utils/miljø';

const StyledTable = styled.table`
    width: 60%;
    padding: 2rem;
    margin-left: 1rem;
`;

const TabellData: PartialRecord<keyof Behandling | 'vedtaksdato', string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    behandlingsårsak: 'Årsak',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
    resultat: 'Resultat',
};

interface BehandlingsoversiktTabellBehandling {
    id: string;
    type: Behandlingstype | TilbakekrevingBehandlingstype;
    årsak?: Behandlingsårsak;
    henlagtÅrsak?: EHenlagtårsak;
    status: string;
    vedtaksdato?: string;
    resultat?: BehandlingResultat | TilbakekrevingBehandlingsresultatstype;
    opprettet: string;
    applikasjon: string;
}

export const BehandlingsoversiktTabell: React.FC<{
    behandlinger: Behandling[];
    eksternFagsakId: number;
    tilbakekrevingBehandlinger: TilbakekrevingBehandling[];
}> = ({ behandlinger, eksternFagsakId, tilbakekrevingBehandlinger }) => {
    const generelleBehandlinger: BehandlingsoversiktTabellBehandling[] = behandlinger.map(
        (behandling) => {
            return {
                id: behandling.id,
                type: behandling.type,
                årsak: behandling.behandlingsårsak,
                henlagtÅrsak: behandling.henlagtÅrsak,
                status: behandling.status,
                resultat: behandling.resultat,
                opprettet: behandling.opprettet,
                vedtaksdato: behandling.vedtaksdato,
                applikasjon: BehandlingApplikasjon.EF_SAK,
            };
        }
    );

    const generelleTilbakekrevingBehandlinger: BehandlingsoversiktTabellBehandling[] =
        tilbakekrevingBehandlinger.map((tilbakekrevingBehandling) => {
            return {
                id: tilbakekrevingBehandling.behandlingId,
                type: tilbakekrevingBehandling.type,
                status: tilbakekrevingBehandling.status,
                vedtaksdato: tilbakekrevingBehandling.vedtaksdato,
                resultat: tilbakekrevingBehandling.resultat,
                opprettet: tilbakekrevingBehandling.opprettetTidspunkt,
                applikasjon: BehandlingApplikasjon.TILBAKEKREVING,
            };
        });

    const alleBehandlinger = generelleBehandlinger.concat(generelleTilbakekrevingBehandlinger);

    const { sortertListe, settSortering, sortConfig } =
        useSorteringState<BehandlingsoversiktTabellBehandling>(alleBehandlinger, {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'descending',
        });

    const lagTilbakekrevingslenke = (eksternFagsakId: number, behandlingId: string): string => {
        return `${tilbakekrevingBaseUrl()}/fagsystem/EF/fagsak/${eksternFagsakId}/behandling/${behandlingId}`;
    };

    const lagKlagebehandlingsLenke = (behandlingId: string): string => {
        return `${klageBaseUrl()}behandling/${behandlingId}/formkrav`;
    };

    const lagEksternBehandlingApplikasjonLenke = (
        eksternFagsakId: number,
        behandlingId: string,
        behandlingApplikasjon: string
    ): string => {
        if (behandlingApplikasjon === BehandlingApplikasjon.TILBAKEKREVING) {
            return lagTilbakekrevingslenke(eksternFagsakId, behandlingId);
        }
        return lagKlagebehandlingsLenke(behandlingId);
    };

    const finnÅrsak = (behandling: BehandlingsoversiktTabellBehandling): string =>
        behandling.type === TilbakekrevingBehandlingstype.TILBAKEKREVING
            ? 'Feilutbetaling'
            : behandling.årsak
            ? behandlingOgTilbakekrevingsårsakTilTekst[behandling.årsak]
            : '-';

    const finnHenlagtÅrsak = (behandling: BehandlingsoversiktTabellBehandling): string =>
        behandling.henlagtÅrsak ? ` (${henlagtÅrsakTilTekst[behandling.henlagtÅrsak]})` : '';

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([felt, tekst], index) => (
                        <SorteringsHeader
                            rekkefolge={
                                sortConfig?.sorteringsfelt === felt
                                    ? sortConfig?.rekkefolge
                                    : undefined
                            }
                            tekst={tekst}
                            onClick={() =>
                                settSortering(felt as keyof BehandlingsoversiktTabellBehandling)
                            }
                            key={`${index}${felt}`}
                        />
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortertListe.map((behandling) => {
                    return (
                        <tr key={behandling.id}>
                            <td>{formaterIsoDatoTid(behandling.opprettet)}</td>
                            <td>{formatterEnumVerdi(behandling.type)}</td>
                            <td>{finnÅrsak(behandling)}</td>
                            <td>{formatterEnumVerdi(behandling.status)}</td>
                            <td>
                                {behandling.vedtaksdato &&
                                    formaterIsoDatoTid(behandling.vedtaksdato)}
                            </td>
                            <td>
                                {behandling.applikasjon === BehandlingApplikasjon.EF_SAK ? (
                                    <Link
                                        className="lenke"
                                        to={{ pathname: `/behandling/${behandling.id}` }}
                                    >
                                        {behandling.resultat &&
                                            behandlingResultatInkludertTilbakekrevingTilTekst[
                                                behandling.resultat
                                            ]}
                                        {finnHenlagtÅrsak(behandling)}
                                    </Link>
                                ) : (
                                    <a
                                        className="lenke"
                                        target="_blank"
                                        rel="noreferrer"
                                        href={lagEksternBehandlingApplikasjonLenke(
                                            eksternFagsakId,
                                            behandling.id,
                                            behandling.applikasjon
                                        )}
                                    >
                                        {behandling.resultat
                                            ? behandlingResultatInkludertTilbakekrevingTilTekst[
                                                  behandling.resultat
                                              ]
                                            : 'Ikke satt'}
                                    </a>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};
