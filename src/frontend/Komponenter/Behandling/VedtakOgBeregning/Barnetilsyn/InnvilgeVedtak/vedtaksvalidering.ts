import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import {
    ERadioValg,
    EUtgiftsperiodetype,
    IPeriodeMedBeløp,
    IUtgiftsperiode,
} from '../../../../../App/typer/vedtak';
import {
    erMånedÅrEtter,
    erMånedÅrEtterEllerLik,
    erPåfølgendeÅrMåned,
} from '../../../../../App/utils/dato';
import { erOpphørEllerSanksjon } from '../Felles/utils';
import {
    fraPeriodeErEtterTilPeriode,
    ugyldigEtterfølgendePeriodeFeilmelding,
    validerGyldigTallverdi,
} from '../../Felles/utils';

export const validerInnvilgetVedtakForm = ({
    utgiftsperioder,
    harKontantstøtte,
    kontantstøtteperioder,
    harTilleggsstønad,
    skalStønadReduseres,
    tilleggsstønadsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            utgiftsperioder,
            harKontantstøtte,
            kontantstøtteperioder,
            harTilleggsstønad,
            skalStønadReduseres,
            tilleggsstønadsperioder,
        }),
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
        skalStønadReduseres:
            skalStønadReduseres === ERadioValg.IKKE_SATT ? 'Mangler verdi' : undefined,
        ...validerTilleggsstønadPerioder({ tilleggsstønadsperioder }, skalStønadReduseres),
        harTilleggsstønad:
            harTilleggsstønad !== ERadioValg.IKKE_SATT ? 'Skal være ikke være satt' : undefined,
    };
};

export const validerUtgiftsperioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: IUtgiftsperiode[];
}): FormErrors<{ utgiftsperioder: IUtgiftsperiode[] }> => {
    const feilIUtgiftsperioder = utgiftsperioder.map((utgiftsperiode, index) => {
        const { periodetype, aktivitetstype, årMånedFra, årMånedTil, barn, utgifter } =
            utgiftsperiode;
        let utgiftsperiodeFeil: FormErrors<IUtgiftsperiode> = {
            periodetype: undefined,
            aktivitetstype: undefined,
            årMånedFra: undefined,
            årMånedTil: undefined,
            barn: [],
            utgifter: validerGyldigTallverdi(utgifter),
        };
        const erSistePeriode = index === utgiftsperioder.length - 1;

        if (!periodetype) {
            utgiftsperiodeFeil = {
                ...utgiftsperiodeFeil,
                periodetype: 'Mangler valg for periodetype',
            };
        }
        if (periodetype === EUtgiftsperiodetype.OPPHØR && erSistePeriode) {
            utgiftsperiodeFeil = {
                ...utgiftsperiodeFeil,
                periodetype: 'Siste periode kan ikke være opphør/ingen stønad',
            };
        }

        const opphørEllerSanksjon = erOpphørEllerSanksjon(periodetype);

        if (opphørEllerSanksjon && aktivitetstype) {
            utgiftsperiodeFeil = {
                ...utgiftsperiodeFeil,
                aktivitetstype: 'Skal ikke kunne velge aktivitetstype ved opphør eller sanksjon',
            };
        }

        if (!aktivitetstype && !opphørEllerSanksjon) {
            utgiftsperiodeFeil = {
                ...utgiftsperiodeFeil,
                aktivitetstype: 'Mangler valg for aktivitetstype',
            };
        }

        if (!årMånedTil || !årMånedFra) {
            return { ...utgiftsperiodeFeil, årMånedFra: 'Mangelfull utfylling av utgiftsperiode' };
        }

        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...utgiftsperiodeFeil,
                årMånedFra: fraPeriodeErEtterTilPeriode,
            };
        }

        const forrigePeriode = index > 0 && utgiftsperioder[index - 1];

        if (forrigePeriode && forrigePeriode.årMånedTil) {
            if (!erMånedÅrEtter(forrigePeriode.årMånedTil, årMånedFra)) {
                return {
                    ...utgiftsperiodeFeil,
                    årMånedFra: ugyldigEtterfølgendePeriodeFeilmelding(),
                };
            }

            if (!erPåfølgendeÅrMåned(forrigePeriode.årMånedTil, årMånedFra)) {
                return {
                    ...utgiftsperiodeFeil,
                    årMånedFra: `Periodene er ikke sammenhengende`,
                };
            }
        }

        if (barn.length < 1 && !opphørEllerSanksjon) {
            return {
                ...utgiftsperiodeFeil,
                barn: ['Mangelfull utfylling - minst et barn må velges'],
            };
        }

        if (barn.length > 0 && opphørEllerSanksjon) {
            return {
                ...utgiftsperiodeFeil,
                barn: ['Skal ikke kunne velge barn ved opphør eller sanksjon'],
            };
        }

        return utgiftsperiodeFeil;
    });

    return {
        utgiftsperioder: feilIUtgiftsperioder,
    };
};

const validerKontantstøttePerioder = (
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
            beløp: validerGyldigTallverdi(periode.beløp),
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
                årMånedFra: fraPeriodeErEtterTilPeriode,
            };
        }
        const forrige = index > 0 && kontantstøtteperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...kontantstøtteperiodeFeil,
                    årMånedFra: ugyldigEtterfølgendePeriodeFeilmelding(),
                };
            }
        }
        return kontantstøtteperiodeFeil;
    });

    return {
        kontantstøtteperioder: feilIKontantstøtteperioder,
    };
};

const validerTilleggsstønadPerioder = (
    {
        tilleggsstønadsperioder,
    }: {
        tilleggsstønadsperioder: IPeriodeMedBeløp[] | undefined;
    },
    stønadsreduksjon: ERadioValg
): FormErrors<{ tilleggsstønadsperioder: IPeriodeMedBeløp[] }> => {
    if (!tilleggsstønadsperioder || stønadsreduksjon === ERadioValg.NEI) {
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
            beløp: validerGyldigTallverdi(periode.beløp),
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
                årMånedFra: fraPeriodeErEtterTilPeriode,
            };
        }
        const forrige = index > 0 && tilleggsstønadsperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...tilleggsstønadPeriodeFeil,
                    årMånedFra: ugyldigEtterfølgendePeriodeFeilmelding(),
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
