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
    KlageHenlagtÅrsak,
    KlageinstansEventType,
    KlageinstansResultat,
    klageinstansUtfallTilTekst,
    KlageÅrsak,
} from '../../App/typer/klage';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Tag, Tooltip } from '@navikt/ds-react';
import { sorterBehandlinger } from '../../App/utils/behandlingutil';
import { AIconWarning } from '@navikt/ds-tokens/dist/tokens';

const StyledTable = styled.table`
    width: 60%;
    padding: 2rem;
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
            if (erKlageFeilregistrertAvKA(behandling)) {
                return 'Feilregistrert (KA)';
            }
        }
        return behandling.resultat ? behandlingResultatTilTekst[behandling.resultat] : 'Ikke satt';
    };

    const erKlageFeilregistrertAvKA = (behandling: BehandlingsoversiktTabellBehandling) =>
        behandling.applikasjon === BehandlingApplikasjon.KLAGE &&
        behandling.klageinstansResultat?.some(
            (resultat) => resultat.type == KlageinstansEventType.BEHANDLING_FEILREGISTRERT
        );

    const ankeHarEksistertPåBehandling = (behandling: BehandlingsoversiktTabellBehandling) => {
        return (
            behandling.applikasjon === BehandlingApplikasjon.KLAGE &&
            behandling.klageinstansResultat?.some(
                (resultat) =>
                    resultat.type === KlageinstansEventType.ANKEBEHANDLING_OPPRETTET ||
                    resultat.type === KlageinstansEventType.ANKEBEHANDLING_AVSLUTTET ||
                    resultat.type === KlageinstansEventType.ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET
            )
        );
    };

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([felt, tekst], index) => (
                        <th role="columnheader" key={`${index}${felt}`}>
                            {tekst}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {alleBehandlinger.map((behandling) => {
                    return (
                        <tr key={behandling.id}>
                            <td>{formaterIsoDatoTid(behandling.opprettet)}</td>
                            <td>
                                <BehandlingType
                                    behandlingType={behandling.type}
                                    kategori={behandling.kategori}
                                />
                            </td>
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
                                            <Tooltip content="Det finnes informasjon om anke på denne klagen. Gå inn på klagebehandlingens resultatside for å se detaljer.">
                                                <AdvarselIkon title={'Har anke informasjon'} />
                                            </Tooltip>
                                        )}
                                        {erKlageFeilregistrertAvKA(behandling) && (
                                            <Tooltip content="Klagen er feilregistrert av NAV klageinstans. Gå inn på klagebehandlingens resultatside for å se detaljer">
                                                <AdvarselIkon
                                                    title={
                                                        'Behandling feilregistrert av NAV klageinstans'
                                                    }
                                                />
                                            </Tooltip>
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
