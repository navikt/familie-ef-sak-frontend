import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { AndelTilkjentYtelse, TilkjentYtelse } from '../../../App/typer/tilkjentytelse';

export const delmalTilHtml = (tilkjentYtelse?: TilkjentYtelse) => {
    return { inntektsperioderHtml: lagInntektsperioder(tilkjentYtelse) };
};

const borderStyling = 'border: 1px solid black; padding: 3px 5px 3px 5px;';
const lagInntektsperioder = (tilkjentYtelse?: TilkjentYtelse): string => {
    const fradagStørreEnnNullEksisterer = tilkjentYtelse?.andeler.some(
        (andel) => andel.samordningsfradrag > 0
    );
    const tabellHeadereUtenSamordning = `<table style="margin-left: 2px; border-collapse: collapse; ${borderStyling}">
                <thead><tr>
                    <th style="width: 160px; ${borderStyling}">Periode</th>
                    <th style="width: 75px; ${borderStyling}">Årsinntekt</th>
                    <th style="width: 150px; word-wrap: break-word; ${borderStyling}">Dette får du i overgangsstønad pr. måned</th>`;
    const samordningHeader = `<th style="width: 85px; ${borderStyling}">Samordning</th>`;
    const tabellRader = `</tr></thead><tbody>${lagRaderForVedtak(
        tilkjentYtelse,
        fradagStørreEnnNullEksisterer
    )}</tbody></table>`;
    return (
        tabellHeadereUtenSamordning +
        (fradagStørreEnnNullEksisterer ? samordningHeader : ``) +
        tabellRader
    );
};

const lagRaderForVedtak = (
    tilkjentYtelse?: TilkjentYtelse,
    inkluderSamordning?: boolean
): string => {
    if (!tilkjentYtelse) {
        return '';
    }
    return tilkjentYtelse.andeler
        .map((andel: AndelTilkjentYtelse) => {
            const inntekt = formaterTallMedTusenSkille(andel.inntekt);
            const beløp = formaterTallMedTusenSkille(andel.beløp);
            const samordningsfradag = formaterTallMedTusenSkille(andel.samordningsfradrag);
            const tabellRaderUtenSamordning = `<tr>
                    <td style="${borderStyling}">
                        ${formaterNullableIsoDato(andel.stønadFra)} - ${formaterNullableIsoDato(
                andel.stønadTil
            )}
                    </td>
                    <td style="${borderStyling}">${inntekt}</td>
                    <td style="${borderStyling}">${beløp}</td>`;
            const samordningRad = `<td style="${borderStyling}">${samordningsfradag}</td>`;
            return tabellRaderUtenSamordning + (inkluderSamordning ? samordningRad : ``) + `</tr>`;
        })
        .join('');
};
