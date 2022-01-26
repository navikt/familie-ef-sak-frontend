import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { AndelTilkjentYtelse, TilkjentYtelse } from '../../../App/typer/tilkjentytelse';

export const delmalTilHtml = (tilkjentYtelse?: TilkjentYtelse) => {
    return { inntektsperioderHtml: lagInntektsperioder(tilkjentYtelse) };
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
