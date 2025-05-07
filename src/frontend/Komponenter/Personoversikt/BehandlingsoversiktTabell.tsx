import React from 'react';
import {
    Behandling,
    BehandlingKategori,
    BehandlingResultat,
    behandlingResultatTilTekst,
    kategoriTilTekst,
} from '../../App/typer/fagsak';
import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsresultatstype,
    TilbakekrevingBehandlingstype,
} from '../../App/typer/tilbakekreving';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { formatterEnumVerdi } from '../../App/utils/utils';
import {
    behandlingOgTilbakekrevingsårsakTilTekst,
    Behandlingsårsak,
    EHenlagtårsak,
    henlagtÅrsakTilTekst,
} from '../../App/typer/behandlingsårsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import { BehandlingApplikasjon } from './Behandlingsoversikt';
import { PartialRecord } from '../../App/typer/common';
import styled from 'styled-components';
import { klageBaseUrl, tilbakekrevingBaseUrl } from '../../App/utils/miljø';
import {
    KlageBehandling,
    KlagebehandlingResultat,
    KlageHenlagtÅrsak,
    KlageinstansEventType,
    KlageinstansResultat,
    klageinstansUtfallTilTekst,
    KlageÅrsak,
} from '../../App/typer/klage';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Table, Tag, Tooltip } from '@navikt/ds-react';
import { sorterBehandlinger } from '../../App/utils/behandlingutil';
import { AIconWarning } from '@navikt/ds-tokens/dist/tokens';
import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from './HistorikkVedtaksperioder/vedtakshistorikkUtil';

const StyledTable = styled(Table)`
    width: 60%;
    margin-left: 1rem;
`;

const AdvarselIkon = styled(ExclamationmarkTriangleFillIcon)`
    margin-left: 1rem;
    background-color: ${AIconWarning};
`;

const FlexBox = styled.div`
    display: flex;
    gap: 0.75rem;
`;

const finnHenlagtÅrsak = (behandling: BehandlingsoversiktTabellBehandling): string =>
    behandling.henlagtÅrsak ? ` (${henlagtÅrsakTilTekst[behandling.henlagtÅrsak]})` : '';

const lagKlagebehandlingsLenke = (behandlingId: string): string =>
    `${klageBaseUrl()}/behandling/${behandlingId}`;

const lagTilbakekrevingslenke = (eksternFagsakId: number, behandlingId: string): string =>
    `${tilbakekrevingBaseUrl()}/fagsystem/EF/fagsak/${eksternFagsakId}/behandling/${behandlingId}`;

const erKlageFeilregistrertAvKA = (behandling: BehandlingsoversiktTabellBehandling) =>
    behandling.applikasjon === BehandlingApplikasjon.KLAGE &&
    behandling.klageinstansResultat?.some(
        (resultat) => resultat.type == KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

const utledBehandlingResultatTilTekst = (behandling: BehandlingsoversiktTabellBehandling) => {
    if (behandling.applikasjon === BehandlingApplikasjon.KLAGE) {
        if (
            behandling.resultat === BehandlingResultat.HENLAGT &&
            behandling.henlagtÅrsak &&
            behandling.resultat
        ) {
            return `${behandlingResultatTilTekst[behandling.resultat]} (${henlagtÅrsakTilTekst[behandling.henlagtÅrsak]})`;
        }
        const klageBehandlingAvsluttetUtfall = behandling.klageinstansResultat?.find(
            (resultat) =>
                resultat.utfall && resultat.type == KlageinstansEventType.KLAGEBEHANDLING_AVSLUTTET
        )?.utfall;

        if (klageBehandlingAvsluttetUtfall) {
            return klageinstansUtfallTilTekst[klageBehandlingAvsluttetUtfall];
        }
        if (erKlageFeilregistrertAvKA(behandling)) {
            return 'Feilregistrert (KA)';
        }
    }
    return behandling.resultat ? behandlingResultatTilTekst[behandling.resultat] : 'Ikke satt';
};

const lagEksternBehandlingApplikasjonLenke = (
    eksternFagsakId: number,
    behandlingId: string,
    behandlingApplikasjon: BehandlingApplikasjon
): string =>
    behandlingApplikasjon === BehandlingApplikasjon.TILBAKEKREVING
        ? lagTilbakekrevingslenke(eksternFagsakId, behandlingId)
        : lagKlagebehandlingsLenke(behandlingId);

const ankeHarEksistertPåBehandling = (behandling: BehandlingsoversiktTabellBehandling) =>
    behandling.applikasjon === BehandlingApplikasjon.KLAGE &&
    behandling.klageinstansResultat?.some(
        (resultat) =>
            resultat.type === KlageinstansEventType.ANKEBEHANDLING_OPPRETTET ||
            resultat.type === KlageinstansEventType.ANKEBEHANDLING_AVSLUTTET ||
            resultat.type === KlageinstansEventType.ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET
    );

const finnÅrsak = (behandling: BehandlingsoversiktTabellBehandling): string =>
    behandling.type === TilbakekrevingBehandlingstype.TILBAKEKREVING
        ? 'Feilutbetaling'
        : behandling.årsak
          ? behandlingOgTilbakekrevingsårsakTilTekst[behandling.årsak]
          : '-';

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
    henlagtÅrsak?: EHenlagtårsak | KlageHenlagtÅrsak;
    status: string;
    kategori?: BehandlingKategori;
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
                kategori: behandling.kategori,
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
                henlagtÅrsak: behandling.henlagtÅrsak,
            };
        }
    );

    const alleBehandlinger = generelleBehandlinger
        .concat(generelleTilbakekrevingBehandlinger)
        .concat(generelleKlageBehandlinger)
        .sort(sorterBehandlinger);

    return (
        <StyledTable>
            <Table.Header>
                <Table.Row>
                    {Object.entries(TabellData).map(([felt, tekst], index) => (
                        <TableHeaderCellSmall key={`${index}${felt}`}>{tekst}</TableHeaderCellSmall>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {alleBehandlinger.map((behandling) => {
                    return (
                        <Table.Row key={behandling.id}>
                            <TableDataCellSmall>
                                {formaterIsoDatoTid(behandling.opprettet)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                <BehandlingType
                                    behandlingType={behandling.type}
                                    kategori={behandling.kategori}
                                />
                            </TableDataCellSmall>
                            <TableDataCellSmall>{finnÅrsak(behandling)}</TableDataCellSmall>
                            <TableDataCellSmall>
                                {formatterEnumVerdi(behandling.status)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {behandling.vedtaksdato &&
                                    formaterIsoDatoTid(behandling.vedtaksdato)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                <Behandlingsresultat
                                    behandling={behandling}
                                    eksternFagsakId={eksternFagsakId}
                                />
                            </TableDataCellSmall>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </StyledTable>
    );
};

const BehandlingType: React.FC<{ behandlingType: string; kategori?: BehandlingKategori }> = ({
    behandlingType,
    kategori,
}) => {
    if (!kategori || kategori === BehandlingKategori.NASJONAL) {
        return <>{formatterEnumVerdi(behandlingType)}</>;
    }

    return (
        <FlexBox>
            <span>{formatterEnumVerdi(behandlingType)}</span>
            <Tag variant={'warning-filled'} size={'small'}>
                {kategoriTilTekst[kategori]}
            </Tag>
        </FlexBox>
    );
};

const Behandlingsresultat: React.FC<{
    behandling: BehandlingsoversiktTabellBehandling;
    eksternFagsakId: number;
}> = ({ behandling, eksternFagsakId }) => {
    if (behandling.applikasjon === BehandlingApplikasjon.EF_SAK) {
        return (
            <Link className="lenke" to={{ pathname: `/behandling/${behandling.id}` }}>
                {behandling.resultat && behandlingResultatTilTekst[behandling.resultat]}
                {finnHenlagtÅrsak(behandling)}
            </Link>
        );
    }

    return (
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
                <Tooltip content="Det finnes informasjon om anke på denne klagen. Gå inn på klagebehandlingens resultatside for å se detaljer.">
                    <AdvarselIkon title={'Har anke informasjon'} />
                </Tooltip>
            )}
            {erKlageFeilregistrertAvKA(behandling) && (
                <Tooltip content="Klagen er feilregistrert av Nav klageinstans. Gå inn på klagebehandlingens resultatside for å se detaljer">
                    <AdvarselIkon title={'Behandling feilregistrert av Nav klageinstans'} />
                </Tooltip>
            )}
        </>
    );
};
