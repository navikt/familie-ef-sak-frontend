import React from 'react';
import { Behandling, BehandlingResultat, behandlingResultatTilTekst } from '../../App/typer/fagsak';
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
import {
    KlageBehandling,
    KlagebehandlingResultat,
    KlageinstansEventType,
    KlageinstansResultat,
    klageinstansUtfallTilTekst,
    KlageÅrsak,
} from '../../App/typer/klage';
import { WarningColored } from '@navikt/ds-icons';

const StyledTable = styled.table`
    width: 60%;
    padding: 2rem;
    margin-left: 1rem;
`;

const AdvarselIkon = styled(WarningColored)`
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
    type: Behandlingstype | TilbakekrevingBehandlingstype | string;
    årsak?: Behandlingsårsak | KlageÅrsak;
    henlagtÅrsak?: EHenlagtårsak;
    status: string;
    vedtaksdato?: string;
    resultat?:
        | BehandlingResultat
        | TilbakekrevingBehandlingsresultatstype
        | KlagebehandlingResultat;
    opprettet: string;
    applikasjon: BehandlingApplikasjon;
    klageinstansResultat?: KlageinstansResultat[];
}

export const BehandlingsoversiktTabell: React.FC<{
    behandlinger: Behandling[];
    eksternFagsakId: number;
    tilbakekrevingBehandlinger: TilbakekrevingBehandling[];
    klageBehandlinger: KlageBehandling[];
}> = ({ behandlinger, eksternFagsakId, tilbakekrevingBehandlinger, klageBehandlinger }) => {
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
        tilbakekrevingBehandlinger.map((behandling) => {
            return {
                id: behandling.behandlingId,
                type: behandling.type,
                status: behandling.status,
                vedtaksdato: behandling.vedtaksdato,
                resultat: behandling.resultat,
                opprettet: behandling.opprettetTidspunkt,
                applikasjon: BehandlingApplikasjon.TILBAKEKREVING,
            };
        });

    const generelleKlageBehandlinger: BehandlingsoversiktTabellBehandling[] = klageBehandlinger.map(
        (behandling) => {
            return {
                id: behandling.id,
                type: 'Klage',
                status: behandling.status,
                vedtaksdato: behandling.vedtaksdato,
                resultat: behandling.resultat,
                opprettet: behandling.opprettet,
                applikasjon: BehandlingApplikasjon.KLAGE,
                årsak: behandling.årsak,
                klageinstansResultat: behandling.klageinstansResultat,
            };
        }
    );

    const alleBehandlinger = generelleBehandlinger
        .concat(generelleTilbakekrevingBehandlinger)
        .concat(generelleKlageBehandlinger);

    const { sortertListe, settSortering, sortConfig } =
        useSorteringState<BehandlingsoversiktTabellBehandling>(alleBehandlinger, {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'descending',
        });

    const lagTilbakekrevingslenke = (eksternFagsakId: number, behandlingId: string): string => {
        return `${tilbakekrevingBaseUrl()}/fagsystem/EF/fagsak/${eksternFagsakId}/behandling/${behandlingId}`;
    };

    const lagKlagebehandlingsLenke = (behandlingId: string): string => {
        return `${klageBaseUrl()}/behandling/${behandlingId}`;
    };

    const lagEksternBehandlingApplikasjonLenke = (
        eksternFagsakId: number,
        behandlingId: string,
        behandlingApplikasjon: BehandlingApplikasjon
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

    const utledBehandlingResultatTilTekst = (behandling: BehandlingsoversiktTabellBehandling) => {
        if (behandling.applikasjon === BehandlingApplikasjon.KLAGE) {
            const klageBehandlingAvsluttetUtfall = behandling.klageinstansResultat?.find(
                (resultat) =>
                    resultat.utfall &&
                    resultat.type == KlageinstansEventType.KLAGEBEHANDLING_AVSLUTTET
            )?.utfall;

            if (klageBehandlingAvsluttetUtfall) {
                return klageinstansUtfallTilTekst[klageBehandlingAvsluttetUtfall];
            }
        }
        return behandling.resultat ? behandlingResultatTilTekst[behandling.resultat] : 'Ikke satt';
    };

    const ankeHarEksistertPåBehandling = (behandling: BehandlingsoversiktTabellBehandling) => {
        return (
            behandling.applikasjon === BehandlingApplikasjon.KLAGE &&
            behandling.klageinstansResultat &&
            behandling.klageinstansResultat.some(
                (resultat) => resultat.type != KlageinstansEventType.KLAGEBEHANDLING_AVSLUTTET
            )
        );
    };

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
                                            behandlingResultatTilTekst[behandling.resultat]}
                                        {finnHenlagtÅrsak(behandling)}
                                    </Link>
                                ) : (
                                    <>
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
                                            {utledBehandlingResultatTilTekst(behandling)}
                                        </a>
                                        {ankeHarEksistertPåBehandling(behandling) && (
                                            <AdvarselIkon title={'Har anke informasjon'} />
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};
