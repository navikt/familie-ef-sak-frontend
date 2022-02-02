import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { AndelTilkjentYtelse, TilkjentYtelse } from '../../../App/typer/tilkjentytelse';
import { samordningsfradagTilTekst } from '../../../App/typer/vedtak';

export const delmalTilHtml = (tilkjentYtelse?: TilkjentYtelse) => {
    return { inntektsperioderHtml: lagInntektsperioder(tilkjentYtelse) };
};

const borderStyling = 'border: 1px solid black; padding: 3px 5px 3px 5px;';
const lagInntektsperioder = (tilkjentYtelse?: TilkjentYtelse): string => {
    const samordningskolonneTittel: string = tilkjentYtelse?.samordningsfradragType
        ? samordningsfradagTilTekst[tilkjentYtelse.samordningsfradragType]
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
                    ${lagRaderForVedtak(samordningskolonneTittel, tilkjentYtelse)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (inkluderSamordning: string, tilkjentYtelse?: TilkjentYtelse): string => {
    if (!tilkjentYtelse) {
        return '';
    }
    return tilkjentYtelse.andeler
        .map((andel: AndelTilkjentYtelse) => {
            const inntekt = formaterTallMedTusenSkille(andel.inntekt);
            const samordningsfradag = formaterTallMedTusenSkille(andel.samordningsfradrag);
            const beløp = formaterTallMedTusenSkille(andel.beløp);
            const andelsperiode = `${formaterNullableIsoDato(
                andel.stønadFra
            )} - ${formaterNullableIsoDato(andel.stønadTil)}`;

            return `<tr>
                        <td style="${borderStyling}">${andelsperiode}</td>
                        <td style="${borderStyling}">${inntekt}</td>
                        ${
                            inkluderSamordning &&
                            `<td style="${borderStyling}">${samordningsfradag}</td>`
                        }
                        <td style="${borderStyling}">${beløp}</td>
                    </tr>`;
        })
        .join('');
};
