import { AndelTilkjentYtelse, TilkjentYtelse } from './BrevTyper';
import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../utils/formatter';

export const delmalTilHtml = (
    delmalNavn: string,
    tilkjentYtelse?: TilkjentYtelse
): { [htmlFeltNavn: string]: string } => {
    switch (delmalNavn) {
        case 'varierendeInntekt':
            return { inntektsperioderHtml: lagInntektsperioder(tilkjentYtelse) };
        default:
            return {};
    }
};

const lagInntektsperioder = (tilkjentYtelse?: TilkjentYtelse): string => {
    return `<table><thead><tr><th>Periode</th><th>Årsinntekt</th><th>Dette får du i overgangsstønad pr. måned</th></tr></thead>
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
            return `<tr><td>${formaterNullableIsoDato(andel.fraDato)} - ${formaterNullableIsoDato(
                andel.tilDato
            )}</td><td>${inntekt}</td><td>${beløp}</td></tr>`;
        })
        .join('');
};
