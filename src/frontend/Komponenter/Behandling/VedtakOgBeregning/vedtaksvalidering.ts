import {
    EAktivitet,
    EPeriodetype,
    IInntektsperiode,
    IVedtaksperiode,
} from '../../../App/typer/vedtak';
import {
    erMånedÅrEtter,
    erMånedÅrEtterEllerLik,
    erMånedÅrLik,
    plusMåneder,
    tilÅrMåned,
} from '../../../App/utils/dato';
import { InnvilgeVedtakForm } from './InnvilgeVedtak/InnvilgeVedtak';
import { FormErrors } from '../../../App/hooks/felles/useFormState';

export const validerInnvilgetVedtakForm = ({
    perioder,
    inntekter,
    periodeBegrunnelse,
    inntektBegrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const periodeBegrunnelseFeil =
        periodeBegrunnelse === '' || periodeBegrunnelse === undefined
            ? 'Mangelfull utfylling av periodebegrunnelse'
            : undefined;

    const inntektBegrunnelseFeil =
        inntektBegrunnelse === '' || inntektBegrunnelse === undefined
            ? 'Mangelfull utfylling av inntektsbegrunnelse'
            : undefined;

    return {
        ...validerVedtaksperioder({ perioder, inntekter }),
        inntektBegrunnelse: inntektBegrunnelseFeil,
        periodeBegrunnelse: periodeBegrunnelseFeil,
    };
};

export const validerVedtaksperioder = ({
    perioder,
    inntekter,
}: {
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
}): FormErrors<{
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
}> => {
    const seksMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 6));
    const feilIVedtaksPerioder = perioder.map((vedtaksperiode, index) => {
        const { årMånedFra, årMånedTil, aktivitet, periodeType } = vedtaksperiode;
        let vedtaksperiodeFeil: FormErrors<IVedtaksperiode> = {
            aktivitet: undefined,
            periodeType: undefined,
            årMånedFra: undefined,
            årMånedTil: undefined,
        };

        if (periodeType === '' || periodeType === undefined) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, periodeType: 'Mangler periodetype' };
        }

        if (
            periodeType === EPeriodetype.HOVEDPERIODE &&
            (aktivitet === undefined || aktivitet === '')
        ) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, aktivitet: 'Mangler aktivitetstype' };
        }
        if (
            periodeType === EPeriodetype.PERIODE_FØR_FØDSEL &&
            aktivitet !== EAktivitet.IKKE_AKTIVITETSPLIKT
        ) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, aktivitet: 'Mangler aktivitetstype' };
        }

        if (!årMånedTil || !årMånedFra) {
            return { ...vedtaksperiodeFeil, årMånedFra: 'Mangelfull utfylling av vedtaksperiode' };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        const forrige = index > 0 && perioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...vedtaksperiodeFeil,
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
                };
            }
        }
        if (erMånedÅrEtter(seksMånederFremITiden, årMånedFra)) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Startdato (${årMånedFra}) mer enn 6mnd frem i tid`,
            };
        }
        return vedtaksperiodeFeil;
    });

    const inntektsperiodeFeil = inntekter.map((inntektsperiode, index) => {
        const årMånedFra = inntektsperiode.årMånedFra;
        if (!årMånedFra) {
            return { årMånedFra: 'Mangelfull utfylling av inntektsperiode' };
        }
        const førsteVedtaksperiode = perioder[0];
        if (
            index === 0 &&
            førsteVedtaksperiode &&
            førsteVedtaksperiode.årMånedFra &&
            !erMånedÅrLik(årMånedFra, førsteVedtaksperiode.årMånedFra)
        ) {
            return { årMånedFra: 'Første inntektsperiode må være lik vedtaksperiode' };
        }
        const forrige = index > 0 && inntekter[index - 1];
        if (forrige && forrige.årMånedFra) {
            if (!erMånedÅrEtter(forrige.årMånedFra, årMånedFra)) {
                return {
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${forrige.årMånedFra}) må være etter til (${årMånedFra})`,
                };
            }
        }
        if (erMånedÅrEtter(seksMånederFremITiden, årMånedFra)) {
            return {
                årMånedFra: `Startdato (${årMånedFra}) mer enn 6mnd frem i tid`,
            };
        }
        return { årMånedFra: undefined };
    });

    return {
        perioder: feilIVedtaksPerioder,
        inntekter: inntektsperiodeFeil,
    };
};
