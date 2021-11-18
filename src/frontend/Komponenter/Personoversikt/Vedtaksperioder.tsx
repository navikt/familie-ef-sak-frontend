import React, { useMemo } from 'react';
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
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import EtikettBase from 'nav-frontend-etiketter';
import { EPeriodetype, periodetypeTilTekst } from '../../App/typer/vedtak';
import { behandlingstypeTilTekst } from '../../App/typer/behandlingstype';

const StyledTabell = styled.table`
    margin-top: 2rem;
`;

const Rad = styled.tr<{ type?: AndelEndringType }>`
    opacity: ${(props) => (props.type === AndelEndringType.FJERNET ? '50%' : '100%')};
`;

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
            <td>{andel.aktivitet}</td>
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

const Vedtaksperioder: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const periodeHistorikkConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/perioder/fagsak/${fagsakId}/historikk`,
        }),
        [fagsakId]
    );
    const perioder = useDataHenter<AndelHistorikk[], null>(periodeHistorikkConfig);

    return (
        <DataViewer response={{ perioder }}>
            {({ perioder }) => <VedtaksperioderTabell andeler={perioder} />}
        </DataViewer>
    );
};
export default Vedtaksperioder;
