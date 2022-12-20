import {
    EAktivitet,
    EPeriodetype,
    IInntektsperiode,
    IVedtaksperiode,
} from '../../../../App/typer/vedtak';
import {
    erEtter,
    erMånedÅrEtter,
    erMånedÅrEtterEllerLik,
    erMånedÅrLik,
    plusMåneder,
    tilDato,
    tilÅrMåned,
} from '../../../../App/utils/dato';
import { InnvilgeVedtakForm } from './InnvilgeVedtak/InnvilgeVedtak';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { SanksjonereVedtakForm } from '../../Sanksjon/Sanksjonsfastsettelse';

export const validerInnvilgetVedtakForm = ({
    perioder,
    inntekter,
    periodeBegrunnelse,
    inntektBegrunnelse,
    samordningsfradragType,
    yngsteBarnFødselsdato,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const periodeBegrunnelseFeil =
        periodeBegrunnelse === '' || periodeBegrunnelse === undefined
            ? 'Mangelfull utfylling av periodebegrunnelse'
            : undefined;

    const inntektBegrunnelseFeil =
        inntektBegrunnelse === '' || inntektBegrunnelse === undefined
            ? 'Mangelfull utfylling av inntektsbegrunnelse'
            : undefined;

    const samordningsfradagEksisterer = inntekter.some((rad) => rad.samordningsfradrag);

    const typeSamordningFeil =
        samordningsfradagEksisterer && !samordningsfradragType
            ? 'Mangelfull utfylling av type samordningsfradag'
            : undefined;

    return {
        ...validerVedtaksperioder({ perioder, inntekter, yngsteBarnFødselsdato }),
        inntektBegrunnelse: inntektBegrunnelseFeil,
        periodeBegrunnelse: periodeBegrunnelseFeil,
        samordningsfradragType: typeSamordningFeil,
    };
};

const åtteÅrFremITiden = (barnDatoStreng: string) => plusMåneder(tilDato(barnDatoStreng), 96);

const yngsteBarnErOver8FørUtgangAvPerioden = (
    yngsteBarnFødselsdato: string,
    årMånedTil: string | undefined
) => {
    return årMånedTil && erEtter(årMånedTil, åtteÅrFremITiden(yngsteBarnFødselsdato));
};

export const validerVedtaksperioder = ({
    perioder,
    inntekter,
    yngsteBarnFødselsdato,
}: {
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
    yngsteBarnFødselsdato: string;
}): FormErrors<{
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
    yngsteBarnFødselsdato: string;
}> => {
    const syvMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 7));
    const tolvMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 12));

    let harPeriodeFør7mndFremITiden = false;

    const feilIVedtaksPerioder = perioder.map((vedtaksperiode, index) => {
        const { årMånedFra, årMånedTil, aktivitet, periodeType } = vedtaksperiode;
        let vedtaksperiodeFeil: FormErrors<IVedtaksperiode> = {
            aktivitet: undefined,
            periodeType: undefined,
            årMånedFra: undefined,
            årMånedTil: undefined,
        };

        if (
            periodeType === EPeriodetype.HOVEDPERIODE &&
            yngsteBarnErOver8FørUtgangAvPerioden(yngsteBarnFødselsdato, årMånedTil)
        ) {
            vedtaksperiodeFeil = {
                ...vedtaksperiodeFeil,
                periodeType: 'Yngste barn er over 8 før utgang av hovedperiode.',
            };
        }

        if (
            periodeType === EPeriodetype.NY_PERIODE_FOR_NYTT_BARN &&
            yngsteBarnErOver8FørUtgangAvPerioden(yngsteBarnFødselsdato, årMånedTil)
        ) {
            vedtaksperiodeFeil = {
                ...vedtaksperiodeFeil,
                periodeType: 'Yngste barn er over 8 før utgang av periode for nytt barn.',
            };
        }

        if (periodeType === '' || periodeType === undefined) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, periodeType: 'Mangler periodetype' };
        }

        if (aktivitet === undefined || aktivitet === '') {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, aktivitet: 'Mangler aktivitetstype' };
        }
        if (
            periodeType === EPeriodetype.PERIODE_FØR_FØDSEL &&
            aktivitet !== EAktivitet.IKKE_AKTIVITETSPLIKT
        ) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, aktivitet: 'Mangler aktivitetstype' };
        }

        if (!årMånedTil || !årMånedFra) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: 'Mangelfull utfylling av vedtaksperiode',
            };
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

        // Det er gyldig med periode etter 7mnd frem i tiden, hvis det finnes en periode før 7mnd frem i tiden
        if (!erMånedÅrEtter(syvMånederFremITiden, årMånedFra)) {
            harPeriodeFør7mndFremITiden = true;
        }
        if (erMånedÅrEtter(syvMånederFremITiden, årMånedFra) && !harPeriodeFør7mndFremITiden) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Startdato (${årMånedFra}) mer enn 7mnd frem i tid`,
            };
        }
        if (erMånedÅrEtter(tolvMånederFremITiden, årMånedFra) && harPeriodeFør7mndFremITiden) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Startdato (${årMånedFra}) mer enn 12mnd frem i tid`,
            };
        }
        return vedtaksperiodeFeil;
    });

    const inntektsperiodeFeil = inntekter.map((inntektsperiode, index) => {
        const årMånedFra = inntektsperiode.årMånedFra;
        if (!årMånedFra) {
            return { årMånedFra: 'Mangelfull utfylling av inntektsperiode' };
        }
        const førsteInnvilgedeVedtaksperiode =
            perioder.find(
                (vedtaksperiode) => vedtaksperiode.periodeType !== EPeriodetype.MIDLERTIDIG_OPPHØR
            ) || perioder[0];
        if (
            index === 0 &&
            førsteInnvilgedeVedtaksperiode &&
            førsteInnvilgedeVedtaksperiode.årMånedFra &&
            !erMånedÅrLik(årMånedFra, førsteInnvilgedeVedtaksperiode.årMånedFra)
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
        if (erMånedÅrEtter(tolvMånederFremITiden, årMånedFra)) {
            return {
                årMånedFra: `Startdato (${årMånedFra}) mer enn 12mnd frem i tid`,
            };
        }
        return { årMånedFra: undefined };
    });

    return {
        perioder: feilIVedtaksPerioder,
        inntekter: inntektsperiodeFeil,
        yngsteBarnFødselsdato: undefined, // Vi bruker samme type på FormState<T> og FormErrors<T>. Vi setter yngsteBarnDato i formstate for å bruke denne i periodevalidering. Da må vi sette feil = undefined (FormError)
    };
};

export const validerSanksjonereVedtakForm = ({
    sanksjonsårsak,
    internBegrunnelse,
}: SanksjonereVedtakForm): FormErrors<SanksjonereVedtakForm> => {
    const sanksjonsårsakFeil =
        sanksjonsårsak === undefined ? 'Mangelfull utfylling av sanksjonsårsak' : undefined;

    const internBegrunnelseFeil =
        internBegrunnelse === '' || internBegrunnelse === undefined
            ? 'Mangelfull utfylling av intern begrunnelse'
            : undefined;
    return {
        sanksjonsårsak: sanksjonsårsakFeil,
        internBegrunnelse: internBegrunnelseFeil,
    };
};
