import { IInntektsperiode, IValideringsfeil, IVedtaksperiode } from '../../../typer/vedtak';
import { erMånedÅrEtter, erMånedÅrEtterEllerLik, erMånedÅrLik } from '../../../utils/dato';

export const validerVedtaksperioder = (
    inntektsperiodeListe: IInntektsperiode[],
    vedtaksperiodeListe: IVedtaksperiode[]
): IValideringsfeil => {
    const feil: IValideringsfeil = {
        vedtaksperioder: [],
        inntektsperioder: [],
    };

    vedtaksperiodeListe.reduce((forrige: IVedtaksperiode, vedtaksperiode) => {
        const { årMånedFra, årMånedTil } = vedtaksperiode;
        if (!årMånedTil || !årMånedFra) {
            feil.vedtaksperioder.push('Mangelfull utfylling av vedtaksperiode');
            return vedtaksperiode;
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            feil.vedtaksperioder.push(
                `Ugyldig periode - fra (${årMånedFra})  må være før til (${årMånedTil})`
            );
        }
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                feil.vedtaksperioder.push(
                    `Ugyldig etterfølgende periode - fra (${forrige.årMånedTil}) må være etter til (${årMånedFra})`
                );
            }
        }
        return vedtaksperiode;
    });

    inntektsperiodeListe.reduce((forrige: IInntektsperiode, inntektsperiode, index) => {
        const årMånedFra = inntektsperiode.årMånedFra;
        if (!årMånedFra) {
            feil.inntektsperioder.push('Mangelfull utfylling av inntektsperiode');
            return inntektsperiode;
        }
        const førsteVedtaksperiode = vedtaksperiodeListe[0];
        if (
            index === 0 &&
            førsteVedtaksperiode &&
            førsteVedtaksperiode.årMånedFra &&
            !erMånedÅrLik(årMånedFra, førsteVedtaksperiode.årMånedFra)
        ) {
            feil.inntektsperioder.push(`Første inntektsperiode må være lik vedtaksperiode`);
        }
        if (forrige && forrige.årMånedFra) {
            if (!erMånedÅrEtter(årMånedFra, forrige.årMånedFra)) {
                feil.inntektsperioder.push(
                    `Ugyldig etterfølgende periode - fra (${forrige.årMånedFra}) må være etter til (${årMånedFra})`
                );
            }
        }
        return inntektsperiode;
    });

    return feil;
};
