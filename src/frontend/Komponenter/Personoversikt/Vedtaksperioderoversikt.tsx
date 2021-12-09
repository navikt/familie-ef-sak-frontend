import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
    AndelEndringType,
    AndelHistorikk,
    AndelHistorikkEndring,
    AndelHistorikkTypeTilTekst,
} from '../../App/typer/tilkjentytelse';
import {
    formaterIsoDatoTid,
    formaterNullableIsoDatoTid,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import EtikettBase from 'nav-frontend-etiketter';
import { aktivitetTilTekst, EPeriodetype, periodetypeTilTekst } from '../../App/typer/vedtak';
import { Behandlingstype, behandlingstypeTilTekst } from '../../App/typer/behandlingstype';
import { Behandling, BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { Select } from 'nav-frontend-skjema';
import { compareDesc } from 'date-fns';

const StyledTabell = styled.table`
    margin-top: 2rem;
`;

const BehandlingSelect = styled(Select)`
    width: 22rem;
`;

const Rad = styled.tr<{ type?: AndelEndringType }>`
    opacity: ${(props) => (skalMarkeresSomFjernet(props.type) ? '50%' : '100%')};
`;

const skalMarkeresSomFjernet = (type?: AndelEndringType) =>
    type === AndelEndringType.FJERNET || type === AndelEndringType.ERSTATTET;

const vedtakstidspunkt = (andel: AndelHistorikk) => (
    <Link
        className="lenke"
        to={{
            pathname: `/behandling/${andel.behandlingId}`,
        }}
    >
        {formaterIsoDatoTid(andel.vedtakstidspunkt)}
    </Link>
);

function innvilgetEllerOpphørt(b: Behandling) {
    return b.resultat === BehandlingResultat.INNVILGET || b.resultat === BehandlingResultat.OPPHØRT;
}

const sortBehandlinger = (fagsak: Fagsak): Behandling[] =>
    fagsak.behandlinger
        .filter((b) => b.type !== Behandlingstype.BLANKETT && innvilgetEllerOpphørt(b))
        .sort((a, b) => compareDesc(new Date(a.opprettet), new Date(b.opprettet)));

const endring = (endring?: AndelHistorikkEndring) =>
    endring && (
        <Link
            className="lenke"
            to={{
                pathname: `/behandling/${endring.behandlingId}`,
            }}
        >
            {AndelHistorikkTypeTilTekst[endring.type]} (
            {formaterIsoDatoTid(endring.vedtakstidspunkt)})
        </Link>
    );

const etikettType = (periodeType: EPeriodetype) => {
    switch (periodeType) {
        case EPeriodetype.HOVEDPERIODE:
            return 'suksess';
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return 'info';
        case EPeriodetype.UTVIDELSE:
            return 'fokus';
        case EPeriodetype.FORLENGELSE:
            return 'advarsel';
    }
};

const historikkRad = (andel: AndelHistorikk) => {
    return (
        <Rad type={andel.endring?.type}>
            <td>
                {formaterNullableMånedÅr(andel.andel.stønadFra)}
                {' - '}
                {formaterNullableMånedÅr(andel.andel.stønadTil)}
            </td>
            <td>
                <EtikettBase mini type={etikettType(andel.periodeType)}>
                    {periodetypeTilTekst[andel.periodeType]}
                </EtikettBase>
            </td>
            <td>{aktivitetTilTekst[andel.aktivitet]}</td>
            <td>{formaterTallMedTusenSkille(andel.andel.inntekt)}</td>
            <td>{andel.andel.samordningsfradrag}</td>
            <td>{formaterTallMedTusenSkille(andel.andel.beløp)}</td>
            <td>{vedtakstidspunkt(andel)}</td>
            <td>{andel.saksbehandler}</td>
            <td>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {behandlingstypeTilTekst[andel.behandlingType]}
                </Link>
            </td>
            <td>{endring(andel.endring)}</td>
        </Rad>
    );
};

const VedtaksperioderTabell: React.FC<{ andeler: AndelHistorikk[] }> = ({ andeler }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Periodetype</th>
                    <th>Aktivitet</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Saksbehandler</th>
                    <th>Behandlingstype</th>
                    <th>Endring</th>
                </tr>
            </thead>
            <tbody>{andeler.map((periode) => historikkRad(periode))}</tbody>
        </StyledTabell>
    );
};

const Vedtaksperioder: React.FC<{ fagsakId: string; perioderTilOgMedBehandlingId?: string }> = ({
    fagsakId,
    perioderTilOgMedBehandlingId,
}) => {
    const periodeHistorikkConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/perioder/fagsak/${fagsakId}/historikk`,
            params: perioderTilOgMedBehandlingId && {
                tilOgMedBehandlingId: perioderTilOgMedBehandlingId,
            },
        }),
        [fagsakId, perioderTilOgMedBehandlingId]
    );
    const perioder = useDataHenter<AndelHistorikk[], null>(periodeHistorikkConfig);
    return (
        <DataViewer response={{ perioder }}>
            {({ perioder }) => {
                return <VedtaksperioderTabell andeler={perioder} />;
            }}
        </DataViewer>
    );
};

const Vedtaksperioderoversikt: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const [valgtBehandlingId, settValgtBehandlingId] = useState<string>();
    const fagsakConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );
    const fagsak = useDataHenter<Fagsak, null>(fagsakConfig);

    return (
        <DataViewer response={{ fagsak }}>
            {({ fagsak }) => {
                const behandlinger = sortBehandlinger(fagsak);
                return (
                    <>
                        <BehandlingSelect
                            label="Behandling"
                            className="flex-item"
                            onChange={(event) => {
                                const nyesteBehandling = behandlinger[0].id;
                                const nyBehandlingId = event.target.value;
                                const skalNullstille = nyBehandlingId === nyesteBehandling;
                                settValgtBehandlingId(skalNullstille ? undefined : nyBehandlingId);
                            }}
                        >
                            {behandlinger.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {behandlingstypeTilTekst[b.type]}{' '}
                                    {formaterNullableIsoDatoTid(b.opprettet)}
                                </option>
                            ))}
                        </BehandlingSelect>
                        <Vedtaksperioder
                            fagsakId={fagsakId}
                            perioderTilOgMedBehandlingId={valgtBehandlingId}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};
export default Vedtaksperioderoversikt;
