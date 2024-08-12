import {
    AndelEndringType,
    AndelHistorikk,
    AndelHistorikkEndring,
    AndelHistorikkTypeTilTekst,
} from '../../../App/typer/tilkjentytelse';
import { Link } from 'react-router-dom';
import { formaterIsoDatoTid, formaterNullableIsoDato } from '../../../App/utils/formatter';
import { EPeriodetype, EUtgiftsperiodetype } from '../../../App/typer/vedtak';
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { TagProps, Table, HeaderCellProps } from '@navikt/ds-react';
import { OverlappMedOvergangsstønad } from '../../Behandling/TidligereVedtaksperioder/typer';
import { DataCellProps } from '@navikt/ds-react/src/table/DataCell';

export const HistorikkTabell = styled(Table)`
    margin-top: 1rem;
`;

export const HistorikkRad = styled(Table.Row)<{ $type?: AndelEndringType }>`
    opacity: ${(props) => (skalMarkeresSomFjernet(props.$type) ? '50%' : '100%')};
`;

export const skalMarkeresSomFjernet = (type?: AndelEndringType) =>
    type === AndelEndringType.FJERNET || type === AndelEndringType.ERSTATTET;

export const TableDataCellSmall = forwardRef<HTMLTableCellElement, DataCellProps>((props, ref) => (
    <Table.DataCell textSize={'small'} {...props} ref={ref} />
));
TableDataCellSmall.displayName = 'TableDataCellSmall';

export const TableHeaderCellSmall = forwardRef<HTMLTableCellElement, HeaderCellProps>(
    (props, ref) => <Table.HeaderCell textSize={'small'} {...props} ref={ref} />
);
TableHeaderCellSmall.displayName = 'TableHeaderCellSmall';

export const historikkEndring = (endring?: AndelHistorikkEndring) =>
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

export const etikettTypeOvergangsstønad = (periodeType?: EPeriodetype): TagProps['variant'] => {
    switch (periodeType) {
        case EPeriodetype.HOVEDPERIODE:
            return 'success';
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return 'info';
        case EPeriodetype.MIGRERING:
        case EPeriodetype.FORLENGELSE:
        case EPeriodetype.UTVIDELSE:
            return 'warning';
        case EPeriodetype.SANKSJON:
            return 'error';
        default:
            return 'info';
    }
};

export const etikettTypeBarnetilsyn = (periodeType?: EUtgiftsperiodetype): TagProps['variant'] => {
    switch (periodeType) {
        case EUtgiftsperiodetype.ORDINÆR:
            return 'success';
        case EUtgiftsperiodetype.OPPHØR:
        case EUtgiftsperiodetype.SANKSJON_1_MND:
            return 'error';
        default:
            return 'info';
    }
};

export const etikettTypeOverlappBarnetilsyn = (
    overlapperMedOvergangsstønad: OverlappMedOvergangsstønad
): TagProps['variant'] => {
    if (overlapperMedOvergangsstønad === OverlappMedOvergangsstønad.JA) {
        return 'success';
    }
    return 'warning';
};

export const datoAndelHistorikk = (andel: AndelHistorikk) => {
    const fra = formaterNullableIsoDato(andel.andel.stønadFra);
    if (andel.erOpphør) {
        return fra;
    } else {
        return `${fra} - ${formaterNullableIsoDato(andel.andel.stønadTil)}`;
    }
};
