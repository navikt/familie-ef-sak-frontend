import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { ERadioValg, IPeriodeMedBeløp, IUtgiftsperiode } from '../../../../App/typer/vedtak';
import { erMånedÅrEtter, erMånedÅrEtterEllerLik } from '../../../../App/utils/dato';

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
        const { årMånedFra, årMånedTil } = utgiftsperiode;
        const utgiftsperiodeFeil: FormErrors<IUtgiftsperiode> = {
            årMånedFra: undefined,
            årMånedTil: undefined,
            barn: [],
            utgifter: undefined,
            nullbeløp: undefined,
        };

        if (!årMånedTil || !årMånedFra) {
            return { ...utgiftsperiodeFeil, årMånedFra: 'Mangelfull utfylling av utgiftsperiode' };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...utgiftsperiodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        const forrige = index > 0 && utgiftsperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...utgiftsperiodeFeil,
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
                };
            }
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
            årMånedFra: undefined,
            årMånedTil: undefined,
            beløp: undefined,
        };
        return { kontantstøtteperioder: [kontantstøtteperiodeFeil] };
    }
    const feilIKontantstøtteperioder = kontantstøtteperioder.map((periode, index) => {
        const { årMånedFra, årMånedTil } = periode;
        const kontantstøtteperiodeFeil: FormErrors<IPeriodeMedBeløp> = {
            årMånedFra: undefined,
            årMånedTil: undefined,
            beløp: undefined,
        };

        if (!årMånedTil || !årMånedFra) {
            return {
                ...kontantstøtteperiodeFeil,
                årMånedFra: 'Mangelfull utfylling av periode',
            };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...kontantstøtteperiodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        const forrige = index > 0 && kontantstøtteperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...kontantstøtteperiodeFeil,
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
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
            årMånedFra: undefined,
            årMånedTil: undefined,
            beløp: undefined,
        };
        return { tilleggsstønadsperioder: [tilleggsstønadsperiodeFeil] };
    }
    const feilITilleggsstønadPerioder = tilleggsstønadsperioder.map((periode, index) => {
        const { årMånedFra, årMånedTil } = periode;
        const tilleggsstønadPeriodeFeil: FormErrors<IPeriodeMedBeløp> = {
            årMånedFra: undefined,
            årMånedTil: undefined,
            beløp: undefined,
        };

        if (!årMånedTil || !årMånedFra) {
            return {
                ...tilleggsstønadPeriodeFeil,
                årMånedFra: 'Mangelfull utfylling av periode',
            };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...tilleggsstønadPeriodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        const forrige = index > 0 && tilleggsstønadsperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...tilleggsstønadPeriodeFeil,
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
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
