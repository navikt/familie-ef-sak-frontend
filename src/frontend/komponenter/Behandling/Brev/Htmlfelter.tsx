import { AndelTilkjentYtelse, TilkjentYtelse } from './BrevTyper';
import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../utils/formatter';

export const delmalTilHtml = (
    delmalNavn: string,
    tilkjentYtelse?: TilkjentYtelse
): { [htmlFeltNavn: string]: string } => {
    switch (delmalNavn) {
        case 'varierendeInntekt':
            return { inntektsperioderHtml: lagInntektsperioder(tilkjentYtelse) };
        case 'testHtml':
            return { inntektsperioderHtml: lagInntektsperioder(tilkjentYtelse) };
        default:
            return {};
    }
};
const borderStyling = 'border: 1px solid black; padding:3px 8px 3px 8px';
const lagInntektsperioder = (tilkjentYtelse?: TilkjentYtelse): string => {
    return `<table style="margin-left: 2px; border-collapse: collapse; ${borderStyling}"><thead><tr>
                <th style="${borderStyling}">Periode</th>
                <th style="${borderStyling}">Årsinntekt</th>
                <th style="${borderStyling}">Dette får du i overgangsstønad pr. måned</th></tr></thead>
                <tbody>${lagRaderForVedtak(tilkjentYtelse)}</tbody>
            </table>`;
};

const lagRaderForVedtak = (tilkjentYtelse?: TilkjentYtelse): string => {
    if (!tilkjentYtelse) {
        return '';
    }
    return tilkjentYtelse.andeler
        .map((andel: AndelTilkjentYtelse) => {
            const inntekt = formaterTallMedTusenSkille(andel.inntekt);
            const beløp = formaterTallMedTusenSkille(andel.beløp);
            return `<tr><td style="${borderStyling}">${formaterNullableIsoDato(
                andel.stønadFra
            )} - ${formaterNullableIsoDato(
                andel.stønadTil
            )}</td><td style="${borderStyling}">${inntekt}</td><td style="${borderStyling}">${beløp}</td></tr>`;
        })
        .join('');
};
