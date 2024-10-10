import { AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import { formaterIsoDatoTid, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { Sanksjonsårsak, sanksjonsårsakTilTekst } from '../../../App/typer/Sanksjonsårsak';
import React from 'react';
import {
    TableDataCellSmall,
    datoAndelHistorikk,
    etikettTypeBarnetilsyn,
    TableHeaderCellSmall,
    historikkEndring,
    HistorikkRad,
    HistorikkTabell,
} from './vedtakshistorikkUtil';
import {
    EUtgiftsperiodetype,
    utgiftsperiodeAktivitetTilTekst,
    utgiftsperiodetypeTilTekst,
} from '../../../App/typer/vedtak';
import { utledHjelpetekstForBeløpFørFratrekkOgSatsjusteringForVedtaksside } from '../../Behandling/VedtakOgBeregning/Felles/utils';
import { HelpText, HStack, Table, Tag } from '@navikt/ds-react';
import styled from 'styled-components';

const Rad = styled.div`
    display: grid;
    grid-template-area: beløp hjelpetekst;
    grid-template-columns: 3rem 1.75rem;
`;

const LinjeSplitter = styled.div`
    margin-top: 0.25rem;
`;

const historikkRad = (andel: AndelHistorikk, index: number) => {
    const beløpErRedusertPgaSats = andel.andel.beløpFørFratrekkOgSatsJustering > andel.andel.sats;
    const beløpErRedusertPgaTilleggsstønad = andel.andel.tilleggsstønad > 0;
    const stønadsbeløpetErRedusert = beløpErRedusertPgaSats || beløpErRedusertPgaTilleggsstønad;

    const erSanksjon = andel.periodetypeBarnetilsyn === EUtgiftsperiodetype.SANKSJON_1_MND;
    const erOpphør = andel.erOpphør;
    const visDetaljer =
        !erSanksjon && !erOpphør && andel.periodetypeBarnetilsyn !== EUtgiftsperiodetype.OPPHØR;

    const utledAktivitetskolonneTekst = (): string => {
        if (erSanksjon) return sanksjonsårsakTilTekst[andel.sanksjonsårsak as Sanksjonsårsak];
        if (andel.aktivitetBarnetilsyn)
            return utgiftsperiodeAktivitetTilTekst[andel.aktivitetBarnetilsyn];
        return 'Ukjent';
    };

    const antallMåneder = andel.andel.beregnetAntallMåneder;
    return (
        <HistorikkRad $type={andel.endring?.type} key={index}>
            <TableDataCellSmall>
                <HStack gap={'2'}>
                    {datoAndelHistorikk(andel)}
                    {antallMåneder && (
                        <Tag variant="alt3" size="xsmall">
                            {andel.andel.beregnetAntallMåneder}
                        </Tag>
                    )}
                </HStack>
            </TableDataCellSmall>
            <TableDataCellSmall>
                {erOpphør ? (
                    <Tag
                        variant={etikettTypeBarnetilsyn(EUtgiftsperiodetype.OPPHØR)}
                        size={'small'}
                    >
                        Opphør
                    </Tag>
                ) : (
                    andel.periodetypeBarnetilsyn && (
                        <Tag
                            variant={etikettTypeBarnetilsyn(andel.periodetypeBarnetilsyn)}
                            size={'small'}
                        >
                            {utgiftsperiodetypeTilTekst[andel.periodetypeBarnetilsyn]}
                        </Tag>
                    )
                )}
            </TableDataCellSmall>
            <TableDataCellSmall>{visDetaljer && utledAktivitetskolonneTekst()}</TableDataCellSmall>
            <TableDataCellSmall>{visDetaljer && andel.andel.antallBarn}</TableDataCellSmall>
            <TableDataCellSmall>
                {visDetaljer && formaterTallMedTusenSkille(andel.andel.utgifter)}
            </TableDataCellSmall>
            <TableDataCellSmall>
                {visDetaljer && formaterTallMedTusenSkille(andel.andel.kontantstøtte)}
            </TableDataCellSmall>
            <TableDataCellSmall>
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
            </TableDataCellSmall>
            <TableDataCellSmall>{formaterIsoDatoTid(andel.vedtakstidspunkt)}</TableDataCellSmall>
            <TableDataCellSmall>{andel.saksbehandler}</TableDataCellSmall>
            <TableDataCellSmall>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {behandlingstypeTilTekst[andel.behandlingType]}
                </Link>
            </TableDataCellSmall>
            <TableDataCellSmall>{historikkEndring(andel.endring)}</TableDataCellSmall>
        </HistorikkRad>
    );
};

const VedtaksperioderBarnetilsyn: React.FC<{ andeler: AndelHistorikk[] }> = ({ andeler }) => {
    return (
        <HistorikkTabell size="small">
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall>Periode (fom-tom)</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Periodetype</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Aktivitet</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Antall barn</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Utgifter</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Kontantstøtte</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Stønadsbeløp pr. md.</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Vedtakstidspunkt</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Saksbehandler</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Behandlingstype</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Endring</TableHeaderCellSmall>
                </Table.Row>
            </Table.Header>
            <Table.Body>{andeler.map((periode, index) => historikkRad(periode, index))}</Table.Body>
        </HistorikkTabell>
    );
};

export default VedtaksperioderBarnetilsyn;
