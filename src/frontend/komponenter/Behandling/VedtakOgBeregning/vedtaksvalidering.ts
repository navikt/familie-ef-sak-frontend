import { EAktivitet, EPeriodetype, IInntektsperiode, IVedtaksperiode } from '../../../typer/vedtak';
import { erMånedÅrEtter, erMånedÅrEtterEllerLik, erMånedÅrLik } from '../../../utils/dato';

export const validerVedtaksPerioder = (
    vedtaksperiodeListe: IVedtaksperiode[]
): (string | undefined)[] => {
    return vedtaksperiodeListe.map((vedtaksperiode, index) => {
        const { årMånedFra, årMånedTil } = vedtaksperiode;
        if (!årMånedTil || !årMånedFra) {
            return 'Mangelfull utfylling av vedtaksperiode';
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return `Ugyldig periode - fra (${årMånedFra})  må være før til (${årMånedTil})`;
        }
        const forrige = index > 0 && vedtaksperiodeListe[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return `Ugyldig etterfølgende periode - fra (${forrige.årMånedTil}) må være etter til (${årMånedFra})`;
            }
        }
        return undefined;
    });
};

export const validerInntektsperioder = (
    inntektsperiodeListe: IInntektsperiode[],
    vedtaksperiodeListe: IVedtaksperiode[]
): (string | undefined)[] => {
    return inntektsperiodeListe.map((inntektsperiode, index) => {
        const årMånedFra = inntektsperiode.årMånedFra;
        if (!årMånedFra) {
            return 'Mangelfull utfylling av inntektsperiode';
        }
        const førsteVedtaksperiode = vedtaksperiodeListe[0];
        if (
            index === 0 &&
            førsteVedtaksperiode &&
            førsteVedtaksperiode.årMånedFra &&
            !erMånedÅrLik(årMånedFra, førsteVedtaksperiode.årMånedFra)
        ) {
            return 'Første inntektsperiode må være lik vedtaksperiode';
        }
        const forrige = index > 0 && inntektsperiodeListe[index - 1];
        if (forrige && forrige.årMånedFra) {
            if (!erMånedÅrEtter(forrige.årMånedFra, årMånedFra)) {
                return `Ugyldig etterfølgende periode - fra (${forrige.årMånedFra}) må være etter til (${årMånedFra})`;
            }
        }
        return undefined;
    });
};

export const validerAktivitetsType = (
    vedtaksperiodeListe: IVedtaksperiode[]
): (string | undefined)[] => {
    return vedtaksperiodeListe.map((v) => {
        if (v.periodeType === EPeriodetype.HOVEDPERIODE) {
            return v.aktivitet === undefined ? 'Mangler aktivitetstype' : undefined;
        } else if (v.periodeType === EPeriodetype.PERIODE_FØR_FØDSEL) {
            return v.aktivitet === EAktivitet.IKKE_AKTIVITETSPLIKT
                ? undefined
                : 'Mangler aktivitetstype';
        }
        return undefined;
    });
};

export const validerPeriodetype = (
    vedtaksperiodeListe: IVedtaksperiode[]
): (string | undefined)[] => {
    return vedtaksperiodeListe.map((v) => (v.periodeType ? undefined : 'Mangler periodetype'));
};
