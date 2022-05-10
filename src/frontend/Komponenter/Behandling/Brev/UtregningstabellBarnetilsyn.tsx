import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn } from '../../../App/typer/vedtak';

export const delmalTilUtregningstabellBT = (
    beløpsperioder?: IBeregningsperiodeBarnetilsyn[] | IBeløpsperiode[]
) => {
    return { inntektsperioderHtml: lagInntektsperioder(beløpsperioder) };
};

const borderStyling = 'border: 1px solid black; padding: 3px 5px 3px 5px;';
const lagInntektsperioder = (
    beløpsperioder?: IBeregningsperiodeBarnetilsyn[] | IBeløpsperiode[]
): string => {
    return `<table style="margin-left: 2px; border-collapse: collapse; ${borderStyling}">
                <thead>
                    <tr>
                        <th style="width: 120px; ${borderStyling}">Periode</th>
                        <th style="width: 50px; ${borderStyling}">Ant. barn</th>
                        <th style="width: 40px; word-wrap: break-word; ${borderStyling}">Utgifter</th>
                        <th style="width: 75px; word-wrap: break-word; ${borderStyling}">Kontantstøtte</th>
                        <th style="width: 75px; word-wrap: break-word; ${borderStyling}">Tilleggsstønad</th>
                        <th style="width: 90px; word-wrap: break-word; ${borderStyling}">Dette får du utbetalt pr. måned</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(beløpsperioder)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (
    beløpsperioder?: IBeregningsperiodeBarnetilsyn[] | IBeløpsperiode[]
): string => {
    if (!beløpsperioder) {
        return '';
    }
    return beløpsperioder
        .map(() => {
            return `<tr>
                        <td style="${borderStyling}">01.01.2022 - 30.04.2021</td>
                        <td style="${borderStyling}">2</td>
                        <td style="${borderStyling}">4000</td>
                        <td style="${borderStyling}">1200</td>
                        <td style="${borderStyling}">1600</td>
                        <td style="${borderStyling}">1234</td>
                    </tr>`;
        })
        .join('');
};
