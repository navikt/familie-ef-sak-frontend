import React, { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import {
    AndelHistorikk,
    AndelEndringType,
    AndelHistorikkTypeTilTekst,
} from '../typer/tilkjentytelse';
import {
    formaterIsoDato,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../utils/formatter';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledTabell = styled.table`
    margin-top: 2rem;
`;

const Rad = styled.tr<{ type?: AndelEndringType }>`
    opacity: ${(props) => (props.type === AndelEndringType.FJERNET ? '50%' : '100%')};
`;

const VedtaksperioderTabell: React.FC<{ perioder: AndelHistorikk[] }> = ({ perioder }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Stønadsbeløp</th>
                    <th>Vedtaksdato</th>
                    <th>Saksbehandler</th>
                    <th>Endring</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad type={periode.endring?.type}>
                        <td>
                            {formaterNullableMånedÅr(periode.andel.stønadFra)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.andel.stønadTil)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.andel.inntekt)}</td>
                        <td>{formaterTallMedTusenSkille(periode.andel.beløp)}</td>
                        <td>
                            {
                                <Link
                                    className="lenke"
                                    to={{
                                        pathname: `/behandling/${periode.behandlingId}`,
                                    }}
                                >
                                    {formaterIsoDato(periode.vedtaksdato)}
                                </Link>
                            }
                        </td>
                        <td>{periode.saksbehandler}</td>
                        <td>
                            {periode.endring && (
                                <Link
                                    className="lenke"
                                    to={{
                                        pathname: `/behandling/${periode.endring.behandlingId}`,
                                    }}
                                >
                                    {AndelHistorikkTypeTilTekst[periode.endring.type]} (
                                    {formaterIsoDato(periode.endring.vedtaksdato)})
                                </Link>
                            )}
                        </td>
                    </Rad>
                ))}
            </tbody>
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
            {({ perioder }) => <VedtaksperioderTabell perioder={perioder} />}
        </DataViewer>
    );
};
export default Vedtaksperioder;
