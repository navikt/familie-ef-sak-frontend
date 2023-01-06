import { AktivitetArbeidTilTekst, AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import { formaterIsoDatoTid, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { Sanksjonsårsak, sanksjonsårsakTilTekst } from '../../../App/typer/Sanksjonsårsak';
import React from 'react';
import {
    datoAndelHistorikk,
    etikettType,
    historikkEndring,
    HistorikkRad,
    HistorikkTabell,
} from './vedtakshistorikkUtil';
import { EPeriodetype, periodetypeTilTekst } from '../../../App/typer/vedtak';
import { utledHjelpetekstForBeløpFørFratrekkOgSatsjusteringForVedtaksside } from '../../Behandling/VedtakOgBeregning/Felles/utils';
import { HelpText, Tag } from '@navikt/ds-react';
import styled from 'styled-components';

const historikkRad = (andel: AndelHistorikk, index: number) => {
    const Rad = styled.div`
        display: grid;
        grid-template-area: beløp hjelpetekst;
        grid-template-columns: 3rem 1.75rem;
    `;

    const LinjeSplitter = styled.div`
        margin-top: 0.25rem;
    `;

    const beløpErRedusertPgaSats = andel.andel.beløpFørFratrekkOgSatsJustering > andel.andel.sats;
    const beløpErRedusertPgaTilleggsstønad = andel.andel.tilleggsstønad > 0;
    const stønadsbeløpetErRedusert = beløpErRedusertPgaSats || beløpErRedusertPgaTilleggsstønad;

    const erSanksjon = andel.erSanksjon;
    const erOpphør = andel.erOpphør;
    const visDetaljer = !erSanksjon && !erOpphør;
    return (
        <HistorikkRad type={andel.endring?.type} key={index}>
            <td>{datoAndelHistorikk(andel)}</td>
            <td>
                {erOpphør && (
                    <Tag variant={'error'} size={'small'}>
                        Opphør
                    </Tag>
                )}
                {erSanksjon && (
                    <Tag variant={etikettType(EPeriodetype.SANKSJON)} size={'small'}>
                        {periodetypeTilTekst[EPeriodetype.SANKSJON]}
                    </Tag>
                )}
            </td>
            <td>
                {erSanksjon
                    ? sanksjonsårsakTilTekst[andel.sanksjonsårsak as Sanksjonsårsak]
                    : andel.aktivitetArbeid && AktivitetArbeidTilTekst[andel.aktivitetArbeid]}
            </td>
            <td>{visDetaljer && andel.andel.antallBarn}</td>
            <td>{visDetaljer && formaterTallMedTusenSkille(andel.andel.utgifter)}</td>
            <td>{visDetaljer && formaterTallMedTusenSkille(andel.andel.kontantstøtte)}</td>
            <td>
                <Rad>
                    {visDetaljer && formaterTallMedTusenSkille(andel.andel.beløp)}
                    {stønadsbeløpetErRedusert && (
                        <HelpText title="Hvor kommer beløpet fra?" placement={'right'}>
                            {utledHjelpetekstForBeløpFørFratrekkOgSatsjusteringForVedtaksside(
                                beløpErRedusertPgaSats,
                                beløpErRedusertPgaTilleggsstønad,
                                andel.andel.antallBarn,
                                andel.andel.beløpFørFratrekkOgSatsJustering,
                                andel.andel.sats,
                                andel.andel.tilleggsstønad
                            ).map((visningstekst, index) => {
                                return index === 0 ? (
                                    <div>{visningstekst}</div>
                                ) : (
                                    <LinjeSplitter>{visningstekst}</LinjeSplitter>
                                );
                            })}
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
    return (
        <HistorikkTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Periodetype</th>
                    <th>Aktivitet</th>
                    <th>Antall barn</th>
                    <th>Utgifter</th>
                    <th>Kontantstøtte</th>
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

export default VedtaksperioderBarnetilsyn;
