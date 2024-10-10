import { AndelHistorikk } from '../../../App/typer/tilkjentytelse';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { Link } from 'react-router-dom';
import { formaterIsoDatoTid, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { aktivitetTilTekst, EPeriodetype, periodetypeTilTekst } from '../../../App/typer/vedtak';
import { Sanksjonsårsak, sanksjonsårsakTilTekst } from '../../../App/typer/Sanksjonsårsak';
import React, { FC } from 'react';
import {
    datoAndelHistorikk,
    etikettTypeOvergangsstønad,
    TableHeaderCellSmall,
    historikkEndring,
    HistorikkRad,
    TableDataCellSmall,
    HistorikkTabell,
} from './vedtakshistorikkUtil';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../../App/typer/behandlingsårsak';
import { HStack, Table, Tag } from '@navikt/ds-react';

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

export const AntallMånederTag: FC<{ andel: AndelHistorikk }> = ({ andel }) => {
    const antallMåneder = andel.andel.beregnetAntallMåneder;

    if (antallMåneder === 0) return null;
    return (
        <Tag variant="alt1" size="xsmall">
            {andel.andel.beregnetAntallMåneder}
        </Tag>
    );
};

const historikkRad = (andel: AndelHistorikk, index: number) => {
    const erSanksjon = andel.periodeType === EPeriodetype.SANKSJON;
    const erOpphør = andel.erOpphør;
    const visDetaljer =
        !erSanksjon && !erOpphør && andel.periodeType !== EPeriodetype.MIDLERTIDIG_OPPHØR;

    return (
        <HistorikkRad $type={andel.endring?.type} key={index}>
            <TableDataCellSmall>
                <HStack gap={'2'}>
                    {datoAndelHistorikk(andel)}
                    <AntallMånederTag andel={andel} />
                </HStack>
            </TableDataCellSmall>
            <TableDataCellSmall>
                {erOpphør ? (
                    <Tag variant={'error'} size={'small'}>
                        Opphør
                    </Tag>
                ) : (
                    <Tag variant={etikettTypeOvergangsstønad(andel.periodeType)} size={'small'}>
                        {periodetypeTilTekst[andel.periodeType || '']}
                    </Tag>
                )}
            </TableDataCellSmall>
            <TableDataCellSmall>
                {erSanksjon
                    ? sanksjonsårsakTilTekst[andel.sanksjonsårsak as Sanksjonsårsak]
                    : aktivitetTilTekst[andel.aktivitet || '']}
            </TableDataCellSmall>
            <TableDataCellSmall>
                {visDetaljer && formaterTallMedTusenSkille(andel.andel.inntekt)}
            </TableDataCellSmall>
            <TableDataCellSmall>
                {visDetaljer && formaterTallMedTusenSkille(andel.andel.samordningsfradrag)}
            </TableDataCellSmall>
            <TableDataCellSmall>
                {visDetaljer && formaterTallMedTusenSkille(andel.andel.beløp)}
            </TableDataCellSmall>
            <TableDataCellSmall>{formaterIsoDatoTid(andel.vedtakstidspunkt)}</TableDataCellSmall>
            <TableDataCellSmall>{andel.saksbehandler}</TableDataCellSmall>
            <TableDataCellSmall>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {lenketekst(andel)}
                </Link>
            </TableDataCellSmall>
            <TableDataCellSmall>{historikkEndring(andel.endring)}</TableDataCellSmall>
        </HistorikkRad>
    );
};

const VedtaksperioderOvergangsstNad: React.FC<{ andeler: AndelHistorikk[] }> = ({ andeler }) => {
    return (
        <HistorikkTabell size="small">
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall>Periode (fom-tom)</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Periodetype</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Aktivitet</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Inntekt</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Samordning</TableHeaderCellSmall>
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

export default VedtaksperioderOvergangsstNad;
