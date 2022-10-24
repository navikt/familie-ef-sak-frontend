import {
    AndelEndringType,
    AndelHistorikkEndring,
    AndelHistorikkTypeTilTekst,
} from '../../../App/typer/tilkjentytelse';
import { Link } from 'react-router-dom';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { EPeriodetype } from '../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { TagProps } from '@navikt/ds-react';

export const HistorikkTabell = styled.table`
    margin-top: 2rem;
`;

export const HistorikkRad = styled.tr<{ type?: AndelEndringType }>`
    opacity: ${(props) => (skalMarkeresSomFjernet(props.type) ? '50%' : '100%')};
`;

export const skalMarkeresSomFjernet = (type?: AndelEndringType) =>
    type === AndelEndringType.FJERNET || type === AndelEndringType.ERSTATTET;

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

export const etikettType = (periodeType?: EPeriodetype): TagProps['variant'] => {
    switch (periodeType) {
        case EPeriodetype.HOVEDPERIODE:
            return 'success';
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return 'info';
        case EPeriodetype.UTVIDELSE:
            return 'warning';
        case EPeriodetype.MIGRERING:
        case EPeriodetype.FORLENGELSE:
        case EPeriodetype.SANKSJON:
            return 'error';
        default:
            return 'info';
    }
};
