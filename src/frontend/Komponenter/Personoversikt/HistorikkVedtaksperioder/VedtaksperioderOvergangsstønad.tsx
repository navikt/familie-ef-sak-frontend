import { AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import {
    formaterIsoDatoTid,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../App/utils/formatter';
import { aktivitetTilTekst, EPeriodetype, periodetypeTilTekst } from '../../../App/typer/vedtak';
import EtikettBase from 'nav-frontend-etiketter';
import { Sanksjonsårsak, sanksjonsårsakTilTekst } from '../../../App/typer/Sanksjonsårsak';
import React from 'react';
import {
    etikettType,
    historikkEndring,
    HistorikkRad,
    HistorikkTabell,
} from './vedtakshistorikkUtil';

const historikkRad = (andel: AndelHistorikk) => {
    const erMigrering = andel.periodeType === EPeriodetype.MIGRERING;
    const erSanksjon = andel.periodeType === EPeriodetype.SANKSJON;
    return (
        <HistorikkRad type={andel.endring?.type}>
            <td>
                {formaterNullableMånedÅr(andel.andel.stønadFra)}
                {' - '}
                {formaterNullableMånedÅr(andel.andel.stønadTil)}
            </td>
            <td>
                <EtikettBase mini type={etikettType(andel.periodeType)}>
                    {periodetypeTilTekst[andel.periodeType || '']}
                </EtikettBase>
            </td>
            <td>
                {erSanksjon
                    ? sanksjonsårsakTilTekst[andel.sanksjonsårsak as Sanksjonsårsak]
                    : aktivitetTilTekst[andel.aktivitet || '']}
            </td>
            <td>{!erSanksjon && formaterTallMedTusenSkille(andel.andel.inntekt)}</td>
            <td>{!erSanksjon && formaterTallMedTusenSkille(andel.andel.samordningsfradrag)}</td>
            <td>{!erSanksjon && formaterTallMedTusenSkille(andel.andel.beløp)}</td>
            <td>{formaterIsoDatoTid(andel.vedtakstidspunkt)}</td>
            <td>{andel.saksbehandler}</td>
            <td>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {erMigrering ? 'Migrering' : behandlingstypeTilTekst[andel.behandlingType]}
                </Link>
            </td>
            <td>{historikkEndring(andel.endring)}</td>
        </HistorikkRad>
    );
};

const VedtaksperioderOvergangsstNad: React.FC<{ andeler: AndelHistorikk[] }> = ({ andeler }) => {
    return (
        <HistorikkTabell className="tabell">
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
        </HistorikkTabell>
    );
};

export default VedtaksperioderOvergangsstNad;
