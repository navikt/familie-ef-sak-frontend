import { IBeregningsperiodeBarnetilsyn } from '../../../App/typer/vedtak';
import { formaterNullableIsoDato, formaterTallMedTusenSkille } from '../../../App/utils/formatter';

export const delmalTilUtregningstabellBT = (beløpsperioder?: IBeregningsperiodeBarnetilsyn[]) => {
    return { inntektsperioderHtml: lagInntektsperioder(beløpsperioder) };
};

const borderStyling = 'border: 1px solid black; padding: 3px 5px 3px 5px;';
const lagInntektsperioder = (beløpsperioder?: IBeregningsperiodeBarnetilsyn[]): string => {
    if (!beløpsperioder) {
        return '';
    }
    const harKontantStøtte = beløpsperioder.some(
        (beløpsperiode) => beløpsperiode.beregningsgrunnlag.kontantstøttebeløp > 0
    );
    const harTilleggsstønad = beløpsperioder.some(
        (beløpsperiode) => beløpsperiode.beregningsgrunnlag.tilleggsstønadsbeløp > 0
    );

    return `<table style="margin-left: 2px; border-collapse: collapse; ${borderStyling}">
                <thead>
                    <tr>
                        <th style="width: 100px; ${borderStyling}">Periode</th>
                        <th style="width: 45px; ${borderStyling}">Ant. barn</th>
                        <th style="width: 35px; word-wrap: break-word; ${borderStyling}">Utgifter</th>
                        ${
                            harKontantStøtte
                                ? `<th style="width: 65px; word-wrap: break-word; ${borderStyling}">
                                    Kontantstøtte
                                </th>`
                                : ''
                        }
                        ${
                            harTilleggsstønad
                                ? `<th style="width: 65px; word-wrap: break-word; ${borderStyling}">Tilleggsstønad</th>`
                                : ''
                        }
                        <th style="width: 70px; word-wrap: break-word; ${borderStyling}">Dette får du utbetalt pr. måned</th>
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

            return `<tr>
                        <td style="${borderStyling}">${andelsperiode}</td>
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
