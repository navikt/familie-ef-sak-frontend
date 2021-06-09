import { TilkjentYtelse } from './BrevTyper';
import { parseISO } from 'date-fns';
import { formaterMånedÅr, formaterTallMedTusenSkille } from '../../../utils/formatter';

export const delmalTilHtml = (
    delmalNavn: string,
    tilkjentYtelse?: TilkjentYtelse
): { [htmlFeltNavn: string]: string } => {
    switch (delmalNavn) {
        case 'htmlDelmal':
            return { inntektsperioder: lagInntektsperioder(tilkjentYtelse) };
        default:
            return {};
    }
};

const lagInntektsperioder = (tilkjentYtelse?: TilkjentYtelse): string => {
    return `<table><thead><tr><th>Periode</th><th>Månedinntekt</th><th>Dette får du i overgangsstønad</th></tr></thead>
<tbody>${lagRaderForVedtak(tilkjentYtelse)}</tbody>
</table>`;
};

const lagRaderForVedtak = (tilkjentYtelse?: TilkjentYtelse): string => {
    if (!tilkjentYtelse) {
        return '';
    }
    return tilkjentYtelse.andeler
        .flatMap((andel) => {
            const inntekt = formaterTallMedTusenSkille(andel.inntekt);
            const beløp = formaterTallMedTusenSkille(andel.beløp);
            return genrerMånedÅrForPeriode(andel.fraDato, andel.tilDato).map(
                (periode) => `<tr><td>${periode}</td><td>${inntekt}</td><td>${beløp}</td></tr>`
            );
        })
        .join('');
};

const genrerMånedÅrForPeriode = (fom: string, tom: string): string[] => {
    const fomDato = parseISO(fom);
    const tomDato = parseISO(tom);
    fomDato.setDate(1);
    tomDato.setDate(1);
    const result: string[] = [];
    while (
        fomDato.getFullYear() <= tomDato.getFullYear() &&
        fomDato.getMonth() <= tomDato.getMonth()
    ) {
        result.push(formaterMånedÅr(fomDato));
        fomDato.setMonth(fomDato.getMonth() + 1);
    }
    return result;
};
