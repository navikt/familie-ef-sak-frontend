import {
    formaterTallMedTusenSkille,
    formaterTilIsoDatoFraTilStreng,
} from '../../../App/utils/formatter';
import {
    ESamordningsfradragtype,
    IBeløpsperiode,
    samordningsfradagTilTekst,
} from '../../../App/typer/vedtak';

export const delmalTilUtregningstabellOS = (beløpsperioder?: IBeløpsperiode[]) => {
    return { inntektsperioderHtml: lagInntektsperioder(beløpsperioder) };
};

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';
const lagInntektsperioder = (beløpsperioder?: IBeløpsperiode[]): string => {
    const samordningsfradragstype: ESamordningsfradragtype | null = beløpsperioder
        ? beløpsperioder[0].beregningsgrunnlag.samordningsfradragType
        : null;
    const samordningskolonneTittel: string = samordningsfradragstype
        ? samordningsfradagTilTekst[samordningsfradragstype]
        : '';

    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <td style="width: 110px; ${borderStylingCompact}" class="charlietest"><strong>Periode</strong></td>
                        <td style="width: 55px; word-wrap: break-word; ${borderStylingCompact}"><strong>Beregnet inntekt</strong></td>
                        ${
                            samordningskolonneTittel &&
                            `<td style="width: 90px; word-wrap: break-word; ${borderStylingCompact}"><strong>${samordningskolonneTittel}</strong></td>`
                        }
                        <td style="width: 55px; word-wrap: break-word; ${borderStylingCompact}"><strong>Dette får du utbetalt pr. måned</strong></td>
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
            const andelsperiode = formaterTilIsoDatoFraTilStreng(
                beløpsperiode.periode.fradato,
                beløpsperiode.periode.tildato
            );

            return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${andelsperiode}</td>
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
