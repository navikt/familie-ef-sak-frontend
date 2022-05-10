import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import {
    ESamordningsfradragtype,
    IBeløpsperiode,
    samordningsfradagTilTekst,
} from '../../../App/typer/vedtak';

export const delmalTilUtregningstabellOSS = (beløpsperioder?: IBeløpsperiode[]) => {
    return { inntektsperioderHtml: lagInntektsperioder(beløpsperioder) };
};

const borderStyling = 'border: 1px solid black; padding: 3px 5px 3px 5px;';
const lagInntektsperioder = (beløpsperioder?: IBeløpsperiode[]): string => {
    const samordningsfradragstype: ESamordningsfradragtype | null = beløpsperioder
        ? beløpsperioder[0].beregningsgrunnlag.samordningsfradragType
        : null;
    const samordningskolonneTittel: string = samordningsfradragstype
        ? samordningsfradagTilTekst[samordningsfradragstype]
        : '';

    return `<table style="margin-left: 2px; border-collapse: collapse; ${borderStyling}">
                <thead>
                    <tr>
                        <th style="width: 160px; ${borderStyling}">Periode</th>
                        <th style="width: 75px; ${borderStyling}">Årsinntekt</th>
                        ${
                            samordningskolonneTittel &&
                            `<th style="width: 85px; ${borderStyling}">${samordningskolonneTittel}</th>`
                        }
                        <th style="width: 150px; word-wrap: break-word; ${borderStyling}">Dette får du i overgangsstønad pr. måned</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(samordningskolonneTittel, beløpsperioder)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (
    samordningskolonneTittel: string,
    beløpsperioder?: IBeløpsperiode[]
): string => {
    if (!beløpsperioder) {
        return '';
    }
    return beløpsperioder
        .map((beløpsperiode: IBeløpsperiode) => {
            const inntekt = formaterTallMedTusenSkille(beløpsperiode.beregningsgrunnlag.inntekt);
            const samordningsfradag = formaterTallMedTusenSkille(
                beløpsperiode.beregningsgrunnlag.samordningsfradrag
            );
            const beløp = formaterTallMedTusenSkille(beløpsperiode.beløp);
            const andelsperiode = `${formaterNullableIsoDato(
                beløpsperiode.periode.fradato
            )} - ${formaterNullableIsoDato(beløpsperiode.periode.tildato)}`;

            return `<tr>
                        <td style="${borderStyling}">${andelsperiode}</td>
                        <td style="${borderStyling}">${inntekt}</td>
                        ${
                            samordningskolonneTittel &&
                            `<td style="${borderStyling}">${samordningsfradag}</td>`
                        }
                        <td style="${borderStyling}">${beløp}</td>
                    </tr>`;
        })
        .join('');
};
