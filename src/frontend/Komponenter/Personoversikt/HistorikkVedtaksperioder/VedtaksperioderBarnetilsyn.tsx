import { AktivitetArbeidTilTekst, AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import {
    formaterIsoDatoTid,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../App/utils/formatter';
import { Sanksjonsårsak, sanksjonsårsakTilTekst } from '../../../App/typer/Sanksjonsårsak';
import React from 'react';
import {
    etikettType,
    historikkEndring,
    HistorikkRad,
    HistorikkTabell,
} from './vedtakshistorikkUtil';
import { EPeriodetype, periodetypeTilTekst } from '../../../App/typer/vedtak';
import EtikettBase from 'nav-frontend-etiketter';
import { utledHjelpetekstForBeløpFørSatsjustering } from '../../Behandling/VedtakOgBeregning/Felles/utils';
import { HelpText } from '@navikt/ds-react';
import styled from 'styled-components';

const historikkRad = (andel: AndelHistorikk, sanksjonFinnes: boolean) => {
    const Rad = styled.div`
        display: grid;
        grid-template-area: beløp hjelpetekst;
        grid-template-columns: 3rem 1.75rem;
    `;

    const erSanksjon = andel.erSanksjon;
    return (
        <HistorikkRad type={andel.endring?.type}>
            <td>
                {formaterNullableMånedÅr(andel.andel.stønadFra)}
                {' - '}
                {formaterNullableMånedÅr(andel.andel.stønadTil)}
            </td>
            {sanksjonFinnes && (
                <td>
                    {erSanksjon && (
                        <EtikettBase mini type={etikettType(EPeriodetype.SANKSJON)}>
                            {periodetypeTilTekst[EPeriodetype.SANKSJON]}
                        </EtikettBase>
                    )}
                </td>
            )}
            <td>
                {erSanksjon
                    ? sanksjonsårsakTilTekst[andel.sanksjonsårsak as Sanksjonsårsak]
                    : andel.aktivitetArbeid && AktivitetArbeidTilTekst[andel.aktivitetArbeid]}
            </td>
            <td>{!erSanksjon && andel.andel.antallBarn}</td>
            <td>{!erSanksjon && formaterTallMedTusenSkille(andel.andel.utgifter)}</td>
            <td>{!erSanksjon && formaterTallMedTusenSkille(andel.andel.kontantstøtte)}</td>
            <td>
                <Rad>
                    {!erSanksjon && formaterTallMedTusenSkille(andel.andel.beløp)}
                    {andel.andel.beløpFørSatsJustering > andel.andel.sats && (
                        <HelpText title="Hvor kommer beløpet fra?" placement={'right'}>
                            {utledHjelpetekstForBeløpFørSatsjustering(
                                andel.andel.antallBarn,
                                andel.andel.beløpFørSatsJustering,
                                andel.andel.sats
                            )}
                        </HelpText>
                    )}
                </Rad>
            </td>
            <td>{formaterIsoDatoTid(andel.vedtakstidspunkt)}</td>
            <td>{andel.saksbehandler}</td>
            <td>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {behandlingstypeTilTekst[andel.behandlingType]}
                </Link>
            </td>
            <td>{historikkEndring(andel.endring)}</td>
        </HistorikkRad>
    );
};

const VedtaksperioderBarnetilsyn: React.FC<{ andeler: AndelHistorikk[] }> = ({ andeler }) => {
    const sanksjonFinnes = andeler.some((andel) => andel.erSanksjon);
    return (
        <HistorikkTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    {sanksjonFinnes && <th></th>}
                    <th>Aktivitet</th>
                    <th>Antall barn</th>
                    <th>Utgifter</th>
                    <th>Kontantstøtte</th>
                    <th>Stønadsbeløp</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Saksbehandler</th>
                    <th>Behandlingstype</th>
                    <th>Endring</th>
                </tr>
            </thead>
            <tbody>{andeler.map((periode) => historikkRad(periode, sanksjonFinnes))}</tbody>
        </HistorikkTabell>
    );
};

export default VedtaksperioderBarnetilsyn;
