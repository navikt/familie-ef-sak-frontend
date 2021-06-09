import { TilkjentYtelse } from './BrevTyper';
import { addMonths, differenceInMonths, parseISO } from 'date-fns';
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
    const antallMåneder = differenceInMonths(tomDato, fomDato) + 1;
    return Array(antallMåneder)
        .fill(null)
        .map((_, index) => {
            return formaterMånedÅr(addMonths(fomDato, index));
        });
};
