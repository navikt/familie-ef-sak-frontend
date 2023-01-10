import { AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import { formaterIsoDatoTid, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { aktivitetTilTekst, EPeriodetype, periodetypeTilTekst } from '../../../App/typer/vedtak';
import { Sanksjonsårsak, sanksjonsårsakTilTekst } from '../../../App/typer/Sanksjonsårsak';
import React from 'react';
import {
    datoAndelHistorikk,
    etikettType,
    historikkEndring,
    HistorikkRad,
    HistorikkTabell,
} from './vedtakshistorikkUtil';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../../App/typer/Behandlingsårsak';
import { Tag } from '@navikt/ds-react';

const lenketekst = (andel: AndelHistorikk) => {
    if (
        andel.behandlingÅrsak === Behandlingsårsak.G_OMREGNING ||
        andel.behandlingÅrsak === Behandlingsårsak.MIGRERING
    ) {
        return behandlingsårsakTilTekst[andel.behandlingÅrsak];
    } else {
        return behandlingstypeTilTekst[andel.behandlingType];
    }
};

const historikkRad = (andel: AndelHistorikk, index: number) => {
    const erSanksjon = andel.periodeType === EPeriodetype.SANKSJON;
    const erOpphør = andel.erOpphør;
    const visDetaljer = !erSanksjon && !erOpphør;
    return (
        <HistorikkRad type={andel.endring?.type} key={index}>
            <td>{datoAndelHistorikk(andel)}</td>
            <td>
                {erOpphør ? (
                    <Tag variant={'error'} size={'small'}>
                        Opphør
                    </Tag>
                ) : (
                    <Tag variant={etikettType(andel.periodeType)} size={'small'}>
                        {periodetypeTilTekst[andel.periodeType || '']}
                    </Tag>
                )}
            </td>
            <td>
                {erSanksjon
                    ? sanksjonsårsakTilTekst[andel.sanksjonsårsak as Sanksjonsårsak]
                    : aktivitetTilTekst[andel.aktivitet || '']}
            </td>
            <td>{visDetaljer && formaterTallMedTusenSkille(andel.andel.inntekt)}</td>
            <td>{visDetaljer && formaterTallMedTusenSkille(andel.andel.samordningsfradrag)}</td>
            <td>{visDetaljer && formaterTallMedTusenSkille(andel.andel.beløp)}</td>
            <td>{formaterIsoDatoTid(andel.vedtakstidspunkt)}</td>
            <td>{andel.saksbehandler}</td>
            <td>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {lenketekst(andel)}
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
                    <th>Stønadsbeløp pr. mnd</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Saksbehandler</th>
                    <th>Behandlingstype</th>
                    <th>Endring</th>
                </tr>
            </thead>
            <tbody>{andeler.map((periode, index) => historikkRad(periode, index))}</tbody>
        </HistorikkTabell>
    );
};

export default VedtaksperioderOvergangsstNad;
