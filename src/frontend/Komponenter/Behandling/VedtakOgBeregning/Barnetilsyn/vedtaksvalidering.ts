import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { ERadioValg, IPeriodeMedBeløp, IUtgiftsperiode } from '../../../../App/typer/vedtak';
import {erFomMånedEtterEllerLikTomMåned, erMangelfullPeriode, erPeriodeEtter} from '../../../../App/utils/dato';

export const validerInnvilgetVedtakForm = ({
    utgiftsperioder,
    harKontantstøtte,
    kontantstøtteperioder,
    harTilleggsstønad,
    tilleggsstønadBegrunnelse,
    skalStønadReduseres,
    tilleggsstønadsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const skalHaBegrunnelseForTilleggsstønad = harTilleggsstønad === ERadioValg.JA;
    const tilleggsstønadBegrunnelseFeil =
        skalHaBegrunnelseForTilleggsstønad && !harVerdi(tilleggsstønadBegrunnelse)
            ? 'Mangelfull utfylling av begrunnelse'
            : undefined;

    return {
        ...validerPerioder({
            utgiftsperioder,
            harKontantstøtte,
            kontantstøtteperioder,
            harTilleggsstønad,
            skalStønadReduseres,
            tilleggsstønadsperioder,
        }),
        tilleggsstønadBegrunnelse: tilleggsstønadBegrunnelseFeil,
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerPerioder = ({
    utgiftsperioder,
    harKontantstøtte,
    kontantstøtteperioder,
    harTilleggsstønad,
    skalStønadReduseres,
    tilleggsstønadsperioder,
}: {
    utgiftsperioder: IUtgiftsperiode[];
    harKontantstøtte: ERadioValg;
    kontantstøtteperioder?: IPeriodeMedBeløp[];
    harTilleggsstønad: ERadioValg;
    skalStønadReduseres: ERadioValg;
    tilleggsstønadsperioder?: IPeriodeMedBeløp[];
}): FormErrors<{
    utgiftsperioder: IUtgiftsperiode[];
    kontantstøtteperioder?: IPeriodeMedBeløp[];
    harKontantstøtte: ERadioValg;
    harTilleggsstønad: ERadioValg;
    skalStønadReduseres: ERadioValg;
    tilleggsstønadsperioder?: IPeriodeMedBeløp[];
}> => {
    return {
        ...validerUtgiftsperioder({ utgiftsperioder }),
        harKontantstøtte: harKontantstøtte === ERadioValg.IKKE_SATT ? 'Mangler verdi' : undefined,
        ...validerKontantstøttePerioder({ kontantstøtteperioder }, harKontantstøtte),
        harTilleggsstønad: harTilleggsstønad === ERadioValg.IKKE_SATT ? 'Mangler verdi' : undefined,
        skalStønadReduseres:
            harTilleggsstønad === ERadioValg.JA && skalStønadReduseres === ERadioValg.IKKE_SATT
                ? 'Mangler verdi'
                : undefined,
        ...validerTilleggsstønadPerioder(
            { tilleggsstønadsperioder },
            harTilleggsstønad,
            skalStønadReduseres
        ),
    };
};

export const validerUtgiftsperioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: IUtgiftsperiode[];
}): FormErrors<{ utgiftsperioder: IUtgiftsperiode[] }> => {
    const feilIUtgiftsperioder = utgiftsperioder.map((utgiftsperiode, index) => {
        const { periode, barn, erMidlertidigOpphør } = utgiftsperiode;
        const utgiftsperiodeFeil: FormErrors<IUtgiftsperiode> = {
            periode: { fom: undefined, tom: undefined },
            barn: [],
            utgifter: undefined,
            erMidlertidigOpphør: undefined,
        };

        if (erMangelfullPeriode(periode)) {
            return { ...utgiftsperiodeFeil, fom: 'Mangelfull utfylling av utgiftsperiode' };
        }

        if (!erFomMånedEtterEllerLikTomMåned(periode)) {
            return {
                ...utgiftsperiodeFeil,
                fom: `Ugyldig periode - fra (${periode.fom}) må være før til (${periode.tom})`,
            };
        }

        const forrige = index > 0 && utgiftsperioder[index - 1];

        if (forrige && forrige.periode) {
            if (!erPeriodeEtter(forrige.periode, periode)) {
                return {
                    ...utgiftsperiodeFeil,
                    fom: `Ugyldig etterfølgende periode - fra (${periode.fom}) må være etter til (${forrige.periode.tom})`,
                };
            }
        }

        if (barn.length < 1 && !erMidlertidigOpphør) {
            return {
                ...utgiftsperiodeFeil,
                barn: ['Mangelfull utfylling - minst et barn må velges'],
            };
        }

        return utgiftsperiodeFeil;
    });

    return {
        utgiftsperioder: feilIUtgiftsperioder,
    };
};

export const validerKontantstøttePerioder = (
    {
        kontantstøtteperioder,
    }: {
        kontantstøtteperioder: IPeriodeMedBeløp[] | undefined;
    },
    kontantstøtte: ERadioValg
): FormErrors<{ kontantstøtteperioder: IPeriodeMedBeløp[] }> | undefined => {
    if (!kontantstøtteperioder || kontantstøtte == ERadioValg.NEI) {
        const kontantstøtteperiodeFeil: FormErrors<IPeriodeMedBeløp> = {
            periode: { fom: undefined, tom: undefined },
            beløp: undefined,
        };
        return { kontantstøtteperioder: [kontantstøtteperiodeFeil] };
    }
    const feilIKontantstøtteperioder = kontantstøtteperioder.map((periodeMedBeløp, index) => {
        const { periode } = periodeMedBeløp;
        const kontantstøtteperiodeFeil: FormErrors<IPeriodeMedBeløp> = {
            periode: { fom: undefined, tom: undefined },
            beløp: undefined,
        };

        if (erMangelfullPeriode(periode)) {
            return {
                ...kontantstøtteperiodeFeil,
                fom: 'Mangelfull utfylling av periode',
            };
        }
        if (!erFomMånedEtterEllerLikTomMåned(periode)) {
            return {
                ...kontantstøtteperiodeFeil,
                fom: `Ugyldig periode - fra (${periode.fom}) må være før til (${periode.tom})`,
            };
        }
        const forrige = index > 0 && kontantstøtteperioder[index - 1];
        if (forrige && forrige.periode) {
            if (!erPeriodeEtter(forrige.periode, periode)) {
                return {
                    ...kontantstøtteperiodeFeil,
                    fom: `Ugyldig etterfølgende periode - fra (${periode.fom}) må være etter til (${forrige.periode.tom})`,
                };
            }
        }
        return kontantstøtteperiodeFeil;
    });

    return {
        kontantstøtteperioder: feilIKontantstøtteperioder,
    };
};

export const validerTilleggsstønadPerioder = (
    {
        tilleggsstønadsperioder,
    }: {
        tilleggsstønadsperioder: IPeriodeMedBeløp[] | undefined;
    },
    tilleggsstønad: ERadioValg,
    stønadsreduksjon: ERadioValg
): FormErrors<{ tilleggsstønadsperioder: IPeriodeMedBeløp[] }> => {
    if (
        !tilleggsstønadsperioder ||
        tilleggsstønad === ERadioValg.NEI ||
        stønadsreduksjon === ERadioValg.NEI
    ) {
        const tilleggsstønadsperiodeFeil: FormErrors<IPeriodeMedBeløp> = {
            periode: { fom: undefined, tom: undefined },
            beløp: undefined,
        };
        return { tilleggsstønadsperioder: [tilleggsstønadsperiodeFeil] };
    }
    const feilITilleggsstønadPerioder = tilleggsstønadsperioder.map((periodeMedBeløp, index) => {
        const { periode } = periodeMedBeløp;
        const tilleggsstønadPeriodeFeil: FormErrors<IPeriodeMedBeløp> = {
            periode: {fom: undefined, tom: undefined},
            beløp: undefined,
        };

        if (erMangelfullPeriode(periode)) {
            return {
                ...tilleggsstønadPeriodeFeil,
                fom: 'Mangelfull utfylling av periode',
            };
        }
        if (!erFomMånedEtterEllerLikTomMåned(periode)) {
            return {
                ...tilleggsstønadPeriodeFeil,
                fom: `Ugyldig periode - fra (${periode.fom}) må være før til (${periode.tom})`,
            };
        }
        const forrige = index > 0 && tilleggsstønadsperioder[index - 1];
        if (forrige && forrige.periode) {
            if (!erPeriodeEtter(forrige.periode, periode)) {
                return {
                    ...tilleggsstønadPeriodeFeil,
                    fom: `Ugyldig etterfølgende periode - fra (${periode.fom}) må være etter til (${forrige.periode.tom})`,
                };
            }
        }
        return tilleggsstønadPeriodeFeil;
    });

    return {
        tilleggsstønadsperioder: feilITilleggsstønadPerioder,
    };
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
