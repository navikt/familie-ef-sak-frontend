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
import { InnvilgeVedtakForm } from './InnvilgeVedtak/Vedtaksform';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { SanksjonereVedtakForm } from '../../Sanksjon/Sanksjonsfastsettelse';
import { erDesimaltall } from '../../../../App/utils/utils';

const attenMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 18));
const syvMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 7));

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

const yngsteBarnErOver8FørTilOgMedMåned = (
    yngsteBarnFødselsdato: string | undefined,
    årMånedTil: string | undefined
) =>
    yngsteBarnFødselsdato &&
    årMånedTil &&
    erEtter(årMånedTil, åtteÅrFremITiden(yngsteBarnFødselsdato));

const skalValidereOver8 = (
    periodeType: EPeriodetype | '' | undefined,
    aktivitet: EAktivitet | '' | undefined
) =>
    periodeType === EPeriodetype.HOVEDPERIODE ||
    periodeType === EPeriodetype.NY_PERIODE_FOR_NYTT_BARN ||
    (periodeType === EPeriodetype.UTVIDELSE &&
        aktivitet === EAktivitet.UTVIDELSE_FORSØRGER_I_UTDANNING);

export const validerVedtaksperioder = ({
    perioder,
    inntekter,
    yngsteBarnFødselsdato,
}: {
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
    yngsteBarnFødselsdato?: string | undefined;
}): FormErrors<{
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
}> => {
    let harPeriodeFør7mndFremITiden = false;

    const feilIVedtaksPerioder = perioder.map((vedtaksperiode, index) => {
        const { årMånedFra, årMånedTil, aktivitet, periodeType } = vedtaksperiode;
        let vedtaksperiodeFeil: FormErrors<IVedtaksperiode> = {
            aktivitet: undefined,
            periodeType: undefined,
            årMånedFra: undefined,
            årMånedTil: undefined,
        };
        const erSistePeriode = index === perioder.length - 1;

        if (
            skalValidereOver8(periodeType, aktivitet) &&
            yngsteBarnErOver8FørTilOgMedMåned(yngsteBarnFødselsdato, årMånedTil)
        ) {
            vedtaksperiodeFeil = {
                ...vedtaksperiodeFeil,
                periodeType: 'Barnet har fylt 8 år før til og med måned',
            };
        }

        if (periodeType === '' || periodeType === undefined) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, periodeType: 'Mangler periodetype' };
        }
        if (periodeType === EPeriodetype.MIDLERTIDIG_OPPHØR && erSistePeriode) {
            vedtaksperiodeFeil = {
                ...vedtaksperiodeFeil,
                periodeType: 'Siste periode kan ikke være opphør/ingen stønad',
            };
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
            if (!erMånedÅrLik(tilÅrMåned(plusMåneder(forrige.årMånedTil, 1)), årMånedFra)) {
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
        if (erMånedÅrEtter(attenMånederFremITiden, årMånedFra) && harPeriodeFør7mndFremITiden) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Startdato (${årMånedFra}) mer enn 18mnd frem i tid`,
            };
        }
        return vedtaksperiodeFeil;
    });

    const inntektsperiodeFeil = inntekter.map((inntektsperiode, index) => {
        return {
            dagsats: validerGyldigTallverdi(inntektsperiode.dagsats),
            forventetInntekt: validerGyldigTallverdi(inntektsperiode.forventetInntekt),
            månedsinntekt: validerGyldigTallverdi(inntektsperiode.månedsinntekt),
            samordningsfradrag: validerGyldigTallverdi(inntektsperiode.samordningsfradrag),
            årMånedFra: validerInntektsperiode(inntektsperiode, perioder, index, inntekter),
        };
    });

    return {
        perioder: feilIVedtaksPerioder,
        inntekter: inntektsperiodeFeil,
    };
};

const validerInntektsperiode = (
    inntektsperiode: IInntektsperiode,
    perioder: IVedtaksperiode[],
    index: number,
    inntekter: IInntektsperiode[]
) => {
    const årMånedFra = inntektsperiode.årMånedFra;
    if (!årMånedFra) {
        return 'Mangelfull utfylling av inntektsperiode';
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
        return 'Første inntektsperiode må være lik vedtaksperiode';
    }
    const forrige = index > 0 && inntekter[index - 1];
    if (forrige && forrige.årMånedFra) {
        if (!erMånedÅrEtter(forrige.årMånedFra, årMånedFra)) {
            return `Ugyldig etterfølgende periode - fra (${forrige.årMånedFra}) må være etter til (${årMånedFra})`;
        }
    }
    if (erMånedÅrEtter(attenMånederFremITiden, årMånedFra)) {
        return `Startdato (${årMånedFra}) mer enn 18mnd frem i tid`;
    }
    const sisteInntektsperiode = perioder[perioder.length - 1].årMånedTil;
    if (sisteInntektsperiode && erMånedÅrEtter(sisteInntektsperiode, årMånedFra)) {
        return `Startdato (${årMånedFra}) mer etter siste inntektsperiode`;
    }
    return undefined;
};

const validerGyldigTallverdi = (verdi: string | number | undefined | null) => {
    const ugyldigVerdiFeilmelding = `Ugyldig verdi - kun heltall tillatt`;
    if (typeof verdi === 'number') {
        return isNaN(verdi) || erDesimaltall(verdi) ? ugyldigVerdiFeilmelding : undefined;
    }
    if (typeof verdi === 'string') {
        return !/^[0-9]+$/.test(verdi) ? ugyldigVerdiFeilmelding : undefined;
    }
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
