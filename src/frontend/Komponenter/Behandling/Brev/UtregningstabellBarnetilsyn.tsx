import { IBeregningsperiodeBarnetilsyn } from '../../../App/typer/vedtak';
import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../App/utils/formatter';

export const delmalTilUtregningstabellBT = (beløpsperioder?: IBeregningsperiodeBarnetilsyn[]) => {
    return { inntektsperioderHtml: lagInntektsperioder(beløpsperioder ?? []) };
};

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';
const lagInntektsperioder = (beløpsperioder: IBeregningsperiodeBarnetilsyn[]): string => {
    const harKontantStøtte = beløpsperioder.some(
        (beløpsperiode) => beløpsperiode.beregningsgrunnlag.kontantstøttebeløp > 0
    );
    const harTilleggsstønad = beløpsperioder.some(
        (beløpsperiode) => beløpsperiode.beregningsgrunnlag.tilleggsstønadsbeløp > 0
    );

    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 100px; ${borderStylingCompact}">Periode</th>
                        <th style="width: 40px; ${borderStylingCompact}">Ant. barn</th>
                        <th style="width: 45px; word-wrap: break-word; ${borderStylingCompact}">Utgifter</th>
                        ${
                            harKontantStøtte
                                ? `<th style="width: 60px; word-wrap: break-word; ${borderStylingCompact}">
                                    Kontantstøtte
                                </th>`
                                : ''
                        }
                        ${
                            harTilleggsstønad
                                ? `<th style="width: 60px; word-wrap: break-word; ${borderStylingCompact}">Tilleggsstønad</th>`
                                : ''
                        }
                        <th style="width: 65px; word-wrap: break-word; ${borderStylingCompact}">Dette får du utbetalt pr. måned</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(beløpsperioder, harKontantStøtte, harTilleggsstønad)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (
    beløpsperioder: IBeregningsperiodeBarnetilsyn[],
    harKontantStøtte: boolean,
    harTilleggsstønad: boolean
): string => {
    return beløpsperioder
        .map((beløpsperiode) => {
            const andelsperiode = `${formaterNullableIsoDato(
                beløpsperiode.periode.fradato
            )} - ${formaterNullableIsoDato(beløpsperiode.periode.tildato)}`;
            const utgifter = formaterTallMedTusenSkille(beløpsperiode.beregningsgrunnlag.utgifter);
            const kontantstøtte = formaterTallMedTusenSkille(
                beløpsperiode.beregningsgrunnlag.kontantstøttebeløp
            );
            const tilleggsstønad = formaterTallMedTusenSkille(
                beløpsperiode.beregningsgrunnlag.tilleggsstønadsbeløp
            );
            const utbetaltBeløp = formaterTallMedTusenSkille(beløpsperiode.beløp);

            return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${andelsperiode}</td>
                        <td style="${borderStyling}">${
                beløpsperiode.beregningsgrunnlag.antallBarn
            }</td>
                        <td style="${borderStyling}">${utgifter}</td>
                        ${
                            harKontantStøtte
                                ? `<td style="${borderStyling}">${kontantstøtte}</td>`
                                : ''
                        }
                       ${
                           harTilleggsstønad
                               ? `<td style="${borderStyling}">${tilleggsstønad}</td>`
                               : ''
                       }
                        <td style="${borderStyling}">${utbetaltBeløp}</td>
                    </tr>`;
        })
        .join('');
};
